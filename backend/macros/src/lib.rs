use core::{fmt, panic};
use std::ops::Deref;

use proc_macro::TokenStream;
use proc_macro2::Span;
use quote::{format_ident, quote};
use syn::{
    parse::{Parse, Parser}, parse_macro_input, punctuated::Punctuated, DeriveInput, Expr, ExprLit, ExprPath, FnArg, Lit, LitBool, Meta, Pat, PatType, Path, Token
};

#[derive(Clone, Debug)]
struct AddedMethodArgs(Vec<FnArg>);

#[derive(Clone, Default)]
struct ExtData {
    query: Option<String>,
    query_generator: Option<Path>,
    add_params: Option<AddedMethodArgs>,
    skip: Option<bool>,
}

impl std::fmt::Debug for ExtData {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        #[derive(Debug)]
        #[allow(dead_code)]
        struct ExtData {
            query: Option<String>,
            query_generator: Option<String>,
            add_params: Option<AddedMethodArgs>,
            skip: Option<bool>,
        }

        let Self {
            query,
            query_generator,
            add_params,
            skip,
        } = self;

        fmt::Debug::fmt(
            &ExtData {
                query: query.clone(),
                query_generator: query_generator
                    .clone()
                    .map(|ref q| q.require_ident().unwrap().to_string()),
                add_params: add_params.clone(),
                skip: skip.clone(),
            },
            f,
        )
    }
}

impl ExtData {
    fn parse(
        input: &mut Punctuated<Meta, Token![,]>,
        ignore_single_and_all: bool,
    ) -> syn::Result<Self> {
        let mut ret = ExtData::default();
        for kv in input.clone() {
            if kv.path().is_ident("single") || kv.path().is_ident("all") {
                if ignore_single_and_all {
                    continue;
                } else {
                    return Err(syn::Error::new(
                        Span::call_site(),
                        "single and all are reserved keywords",
                    ));
                }
            }
            match kv {
                Meta::Path(path) => {
                    if ret.skip.is_some() {
                        return Err(syn::Error::new(Span::call_site(), "skip already set"));
                    }
                    if path.is_ident("skip") {
                        ret.skip = Some(true);
                    }
                }
                Meta::NameValue(mnv) => match mnv.value {
                    Expr::Path(ExprPath { path, .. }) => {
                        if mnv.path.is_ident("query") {
                            if ret.query.is_some() {
                                return Err(syn::Error::new(
                                    Span::call_site(),
                                    "query already set",
                                ));
                            }
                            ret.query_generator = Some(path);
                        }
                    }
                    Expr::Lit(ExprLit {
                        lit: Lit::Bool(LitBool { value, .. }),
                        ..
                    }) => {
                        if mnv.path.is_ident("skip") {
                            if ret.skip.is_some() {
                                return Err(syn::Error::new(Span::call_site(), "skip already set"));
                            }
                            ret.skip = Some(value);
                        }
                    }
                    Expr::Lit(ExprLit {
                        lit: Lit::Str(ref lit_str),
                        ..
                    }) => match mnv.path.require_ident()?.to_string().as_str() {
                        "query" => {
                            if ret.query.is_some() {
                                return Err(syn::Error::new(
                                    Span::call_site(),
                                    "query already set",
                                ));
                            }
                            ret.query = Some(lit_str.value())
                        }
                        "add_params" => {
                            let parser = Punctuated::<FnArg, Token![,]>::parse_terminated;
                            let params = parser.parse_str(lit_str.value().as_str())?;
                            if ret.add_params.is_some() {
                                return Err(syn::Error::new(
                                    Span::call_site(),
                                    "add_params already set",
                                ));
                            }

                            ret.add_params = Some(AddedMethodArgs(params.into_iter().collect()));
                        }
                        _ => {
                            return Err(syn::Error::new(
                                Span::call_site(),
                                format!(
                                    "unknown attribute: {:?}",
                                    mnv.path.require_ident()?.to_string()
                                )
                                .as_str(),
                            ));
                        }
                    },
                    _ => {}
                },
                Meta::List(_) => {}
            }
        }

        if ret.query.is_some() && ret.query_generator.is_some() {
            return Err(syn::Error::new(
                Span::call_site(),
                "query and query_generator are mutually exclusive",
            ));
        }

        Ok(ret)
    }
    fn merge(&self, other: Self) -> Self {
        let mut ret = self.clone();
        if ret.query.is_none() {
            ret.query = other.query;
        }
        if ret.query_generator.is_none() {
            ret.query_generator = other.query_generator;
        }
        if ret.add_params.is_none() {
            ret.add_params = other.add_params;
        }
        if ret.skip.is_none() {
            ret.skip = other.skip;
        }
        ret
    }
}

impl Parse for ExtData {
    fn parse(input: syn::parse::ParseStream) -> syn::Result<Self> {
        let mut parsed = Punctuated::<Meta, Token![,]>::parse_terminated(input)?;

        Self::parse(&mut parsed, true)
    }
}

#[derive(Clone, Default, Debug)]
struct QueryGenArgs {
    default: ExtData,
    single: Option<ExtData>,
    all: Option<ExtData>,
}

impl Parse for QueryGenArgs {
    fn parse(input: syn::parse::ParseStream) -> syn::Result<Self> {
        let mut ret = QueryGenArgs::default();

        let parsed = Punctuated::<Meta, Token![,]>::parse_terminated(input)?;

        for kv in parsed.clone() {
            if kv.path().is_ident("single") || kv.path().is_ident("all") {
                match kv {
                    Meta::List(ref list) => {
                        let parser = Punctuated::<Meta, Token![,]>::parse_terminated;
                        match list.path.require_ident()?.to_string().as_str() {
                            "single" => {
                                let mut parsed = parser.parse2(list.tokens.clone()).unwrap();
                                ret.single = Some(ExtData::parse(&mut parsed, false)?)
                            }
                            "all" => {
                                let mut parsed = parser.parse2(list.tokens.clone()).unwrap();
                                ret.all = Some(ExtData::parse(&mut parsed, false)?)
                            }
                            _ => {
                                return Err(syn::Error::new(
                                    Span::call_site(),
                                    format!(
                                        "unknown attribute: {:?}",
                                        kv.path().require_ident()?.to_string()
                                    )
                                    .as_str(),
                                ));
                            }
                        }
                    }
                    Meta::Path(ref path) => match path.require_ident()?.to_string().as_str() {
                        "single" => ret.single = Some(ExtData::default()),
                        "all" => ret.all = Some(ExtData::default()),
                        _ => {
                            return Err(syn::Error::new(
                                Span::call_site(),
                                format!(
                                    "unknown attribute: {:?}",
                                    path.require_ident()?.to_string()
                                )
                                .as_str(),
                            ));
                        }
                    },
                    Meta::NameValue(ref mnv) => match mnv.value {
                        Expr::Lit(ExprLit {
                            lit: Lit::Bool(LitBool { value, .. }),
                            ..
                        }) => match mnv.path.require_ident()?.to_string().as_str() {
                            "single" => {
                                let mut data = ExtData::default();
                                data.skip = Some(value);
                                ret.single = Some(data)
                            }
                            "all" => {
                                let mut data = ExtData::default();
                                data.skip = Some(value);
                                ret.all = Some(data)
                            }
                            _ => {
                                return Err(syn::Error::new(
                                    Span::call_site(),
                                    format!(
                                        "unknown attribute: {:?}",
                                        mnv.path.require_ident()?.to_string()
                                    )
                                    .as_str(),
                                ));
                            }
                        },
                        _ => {
                            return Err(syn::Error::new(
                                Span::call_site(),
                                format!(
                                    "unknown attribute: {:?}",
                                    mnv.path.require_ident()?.to_string()
                                )
                                .as_str(),
                            ));
                        }
                    },
                }
            }
            //println!("parsed: {:?}", parsed.clone());
            ret.default = ExtData::parse(&mut parsed.clone(), true)?;
        }

        ret.single = if let Some(single) = ret.single.clone() {
            Some(single.merge(ret.default.clone()))
        } else {
            Some(ret.default.clone())
        };

        ret.all = if let Some(all) = ret.all.clone() {
            Some(all.merge(ret.default.clone()))
        } else {
            Some(ret.default.clone())
        };

        Ok(ret)
    }
}

fn parse_args(input: &DeriveInput) -> syn::Result<QueryGenArgs> {
    for attr in &input.attrs {
        if attr.path().is_ident("query_gen") {
            return attr.parse_args();
        }
    }

    Err(syn::Error::new(
        Span::call_site(),
        "#[query_gen(query)] attribute is required",
    ))
}

#[proc_macro_derive(QueryGen, attributes(query_gen))]
pub fn derive_query_gen(input: TokenStream) -> TokenStream {
    let ast: DeriveInput = parse_macro_input!(input);

    let default_opts = parse_args(&ast).unwrap();

    let name = ast.ident.clone();
    let mut quotes = vec![quote!()];
    match ast.data {
        syn::Data::Struct(ref data_struct) => match data_struct.fields {
            syn::Fields::Named(ref fields_named) => {
                for field in fields_named.named.iter() {
                    let mut opts = default_opts.clone();
                    for attr in field.attrs.iter() {
                        if attr.path().is_ident("query_gen") {
                            opts = attr.parse_args().unwrap();

                            opts.single = if let Some(os) = opts.single.clone() {
                                Some(os.merge(default_opts.single.clone().unwrap()))
                            } else {
                                panic!("how is this possible?")
                            };

                            opts.all = if let Some(os) = opts.all.clone() {
                                Some(os.merge(default_opts.all.clone().unwrap()))
                            } else {
                                panic!("how is this possible?")
                            };
                        }
                    }

                    let field_ident = field.ident.clone().unwrap();
                    let ty = &field.ty;
                    let def = opts.default.clone();

                    if def.skip.is_some_and(|x| x) {
                        continue;
                    }

                    if opts.single.clone().unwrap().skip.is_none_or(|x| !x) {
                        let fn_ident = format_ident!("find_by_{}", field_ident);
                        let add_params = opts.single.as_ref().unwrap().clone().add_params;
                        let (add_params, names) = if let Some(x) = add_params {
                            let mut vec = vec![];
                            let mut names = vec![];
                            for param in x.0.iter() {
                                vec.push(param);
                                let name = match param {
                                    syn::FnArg::Typed(PatType { pat, .. }) => match pat.deref() {
                                        Pat::Ident(ident) => ident.ident.clone(),
                                        _ => {
                                            syn::Error::new(Span::call_site(), "incorrect type")
                                                .to_compile_error();
                                            panic!()
                                        }
                                    },
                                    _ => {
                                        syn::Error::new(Span::call_site(), "incorrect type")
                                            .to_compile_error();
                                        panic!()
                                    }
                                };
                                names.push(name);
                            }
                            (quote! { #(#vec),* }, quote! { #(#names),* })
                        } else {
                            (quote!(), quote!())
                        };
                        let query = if opts.single.as_ref().unwrap().query.is_some() {
                            let q = opts.single.as_ref().unwrap().clone().query;
                            quote! { #q }
                        } else {
                            let q = opts.single.as_ref().unwrap().query_generator.clone().unwrap();
                            let fn_name = q.require_ident().unwrap();
                            quote! { #fn_name(stringify!(#field_ident), #names).as_str() }
                        };
                        quotes.push(quote! {
                            pub async fn #fn_ident(&self, #field_ident: #ty, #add_params) -> Option<#name> {
                                sqlx::query_as(#query)
                                    .bind(#field_ident)
                                    .fetch_optional(&*self.get_conn()).await.ok()?
                            }
                        });
                    }

                    if opts.all.clone().unwrap().skip.is_none_or(|x| !x) {
                        let fn_ident = format_ident!("find_all_by_{}", field_ident);
                        let add_params = opts.all.as_ref().unwrap().clone().add_params;
                        let (add_params, names) = if let Some(x) = add_params {
                            let mut vec = vec![];
                            let mut names = vec![];
                            for param in x.0.iter() {
                                vec.push(param);
                                let name = match param {
                                    syn::FnArg::Typed(PatType { pat, .. }) => match pat.deref() {
                                        Pat::Ident(ident) => ident.ident.clone(),
                                        _ => {
                                            syn::Error::new(Span::call_site(), "incorrect type")
                                                .to_compile_error();
                                            panic!()
                                        }
                                    },
                                    _ => {
                                        syn::Error::new(Span::call_site(), "incorrect type")
                                            .to_compile_error();
                                        panic!()
                                    }
                                };
                                names.push(name);
                            }
                            (quote! { #(#vec),* }, quote! { #(#names),* })
                        } else {
                            (quote!(), quote!())
                        };
                        let query = if opts.all.as_ref().unwrap().query.is_some() {
                            let q = opts.all.as_ref().unwrap().clone().query;
                            quote! { #q }
                        } else {
                            let q = opts.all.as_ref().unwrap().query_generator.clone().unwrap();
                            let fn_name = q.require_ident().unwrap();
                            quote! { #fn_name(stringify!(#field_ident), #names).as_str() }
                        };
                        quotes.push(quote! {
                            pub async fn #fn_ident(&self, #field_ident: #ty, #add_params) -> Vec<#name> {
                                sqlx::query_as(#query)
                                    .bind(#field_ident)
                                    .fetch_all(&*self.get_conn()).await.unwrap_or(Vec::new())
                            }
                        });
                    }
                }
            }

            _ => (),
        },

        _ => panic!("Must be a struct"),
    }

    let output = quote! {
        impl crate::db::Table<#name> {
            #(#quotes)*
        }
    };
    //println!("{}", output);

    output.into()
}

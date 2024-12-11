use core::panic;

use proc_macro::TokenStream;
use proc_macro2::Span;
use quote::{format_ident, quote};
use syn::{
    DeriveInput, Expr, ExprLit, ExprPath, Lit, LitBool, Meta, Path, Token, parse::Parse,
    parse_macro_input, punctuated::Punctuated,
};

#[derive(Clone, Debug)]
struct QueryGenArgs {
    query: Option<String>,
    query_generator: Option<Path>,
    skip: Option<bool>,
    language: Option<bool>,
    order: Option<bool>,
    single: Option<bool>,
    all: Option<bool>,
}

impl Parse for QueryGenArgs {
    fn parse(input: syn::parse::ParseStream) -> syn::Result<Self> {
        let mut skip: Option<LitBool> = None;
        let mut language = None;
        let mut order = None;
        let mut query = None;
        let mut query_generator = None;
        let mut single = None;
        let mut all = None;

        let parsed = Punctuated::<Meta, Token![,]>::parse_terminated(input)?;

        for kv in parsed.clone() {
            match kv {
                Meta::NameValue(mnv) => match mnv.value {
                    Expr::Lit(ExprLit {
                        lit: Lit::Bool(lit),
                        ..
                    }) => match mnv.path.require_ident()?.to_string().as_str() {
                        "skip" => {
                            if skip.is_some() {
                                return Err(syn::Error::new(Span::call_site(), "duplicate key"));
                            };
                            skip = Some(lit)
                        }
                        "language" => {
                            if language.is_some() {
                                return Err(syn::Error::new(Span::call_site(), "duplicate key"));
                            };
                            language = Some(lit)
                        }
                        "order" => {
                            if order.is_some() {
                                return Err(syn::Error::new(Span::call_site(), "duplicate key"));
                            };
                            order = Some(lit)
                        }
                        "single" => {
                            if single.is_some() {
                                return Err(syn::Error::new(Span::call_site(), "duplicate key"));
                            };
                            single = Some(lit)
                        }
                        "all" => {
                            if all.is_some() {
                                return Err(syn::Error::new(Span::call_site(), "duplicate key"));
                            };
                            all = Some(lit)
                        }
                        _ => {
                            return Err(syn::Error::new(Span::call_site(), "unexpected key"));
                        }
                    },
                    Expr::Lit(ExprLit {
                        lit: Lit::Str(lit), ..
                    }) => match mnv.path.require_ident()?.to_string().as_str() {
                        "query" => {
                            if query.is_some() {
                                return Err(syn::Error::new(Span::call_site(), "duplicate key"));
                            };
                            query = Some(lit)
                        }
                        "query_generator" => {
                            if query_generator.is_some() {
                                return Err(syn::Error::new(Span::call_site(), "duplicate key"));
                            };
                            query_generator = Some(ExprPath {
                                path: lit.parse()?,
                                qself: None,
                                attrs: vec![],
                            })
                        }
                        _ => {
                            return Err(syn::Error::new(Span::call_site(), "unexpected key str"));
                        }
                    },
                    Expr::Path(path) => match mnv.path.require_ident()?.to_string().as_str() {
                        "query_generator" | "query" => {
                            if query_generator.is_some() {
                                return Err(syn::Error::new(Span::call_site(), "duplicate key"));
                            } else {
                                query_generator = Some(path)
                            }
                        }
                        _ => {
                            return Err(syn::Error::new(
                                Span::call_site(),
                                format!("unexpected key path: {:?}", path.path).as_str(),
                            ));
                        }
                    },
                    _ => {
                        return Err(syn::Error::new(Span::call_site(), "unexpected value"));
                    }
                },
                Meta::List(_) => return Err(syn::Error::new(Span::call_site(), "unexpected list")),
                Meta::Path(path) => match path.require_ident()?.to_string().as_str() {
                    "skip" => {
                        if skip.is_some() {
                            return Err(syn::Error::new(Span::call_site(), "duplicate key"));
                        };
                        skip = Some(LitBool::new(true, Span::call_site()))
                    }
                    "language" => {
                        if language.is_some() {
                            return Err(syn::Error::new(Span::call_site(), "duplicate key"));
                        };
                        language = Some(LitBool::new(true, Span::call_site()))
                    }
                    "order" => {
                        if order.is_some() {
                            return Err(syn::Error::new(Span::call_site(), "duplicate key"));
                        };
                        order = Some(LitBool::new(true, Span::call_site()))
                    }
                    "single" => {
                        if single.is_some() {
                            return Err(syn::Error::new(Span::call_site(), "duplicate key"));
                        };
                        single = Some(LitBool::new(true, Span::call_site()))
                    }
                    "all" => {
                        if all.is_some() {
                            return Err(syn::Error::new(Span::call_site(), "duplicate key"));
                        };
                        all = Some(LitBool::new(true, Span::call_site()))
                    }
                    _ => {
                        return Err(syn::Error::new(
                            Span::call_site(),
                            format!("unexpected key: {:?}", path.require_ident()?).as_str(),
                        ));
                    }
                },
            }
        }

        Ok(QueryGenArgs {
            query: query.map(|b| b.value()),
            query_generator: query_generator.map(|b| b.path),
            skip: skip.map(|b| b.value),
            language: language.map(|b| b.value),
            order: order.map(|b| b.value),
            single: single.map(|b| b.value),
            all: all.map(|b| b.value),
        })
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

    let mut default_opts = parse_args(&ast).unwrap();

    default_opts.language = default_opts.language.or(Some(false));
    default_opts.order = default_opts.order.or(Some(false));
    default_opts.skip = default_opts.skip.or(Some(false));
    default_opts.single = default_opts.single.or(Some(true));
    default_opts.all = default_opts.all.or(Some(false));

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
                            if opts.query.is_some() && opts.query_generator.is_some() {
                                return syn::Error::new(
                                    Span::call_site(),
                                    "either `query` or `query_generator` must be set",
                                )
                                .to_compile_error()
                                .into();
                            }
                            if opts.query.is_none() && opts.query_generator.is_none() {
                                opts.query = default_opts.query.clone();
                                opts.query_generator = default_opts.query_generator.clone();
                            }

                            opts.skip = opts.skip.or(default_opts.skip);
                            opts.language = opts.language.or(default_opts.language);
                            opts.order = opts.order.or(default_opts.order);
                            opts.single = opts.single.or(default_opts.single);
                            opts.all = opts.all.or(default_opts.all);
                        }
                    }
                    let field_ident = field.ident.clone().unwrap();
                    let ty = &field.ty;
                    if opts.skip.unwrap_or(false) {
                        continue;
                    }
                    let (language_ident, language) = if opts.language.unwrap() {
                        (quote!(, language: &str), quote!(Some(language)))
                    } else {
                        (quote!(), quote!(None))
                    };

                    let (order_ident, order) = if opts.order.unwrap() {
                        (quote!(, order: Order), quote!(Some(order)))
                    } else {
                        (quote!(), quote!(None))
                    };
                    let query = if opts.query.is_some() {
                        let q = opts.query.unwrap();
                        quote!(#q)
                    } else {
                        let q = opts.query_generator.unwrap();
                        quote!(#q(stringify!(#field_ident), #language, #order).as_str())
                    };
                    if opts.single.unwrap() {
                        let fn_ident = format_ident!("find_by_{}", field.ident.clone().unwrap());
                        quotes.push(quote!(
                            pub async fn #fn_ident(&self, #field_ident: #ty #language_ident #order_ident) -> Option<#name> {
                                sqlx::query_as(#query)
                                .bind(#field_ident)
                                .fetch_optional(&*self.get_conn())
                                .await
                                .ok()?
                            }
                        ));
                    }
                    if opts.all.unwrap() {
                        let fn_ident =
                            format_ident!("find_all_by_{}", field.ident.clone().unwrap());
                        quotes.push(quote!(
                            pub async fn #fn_ident(&self, #field_ident: #ty #language_ident #order_ident) -> Vec<#name> {
                                sqlx::query_as(#query)
                                .bind(#field_ident)
                                .fetch_all(&*self.get_conn())
                                .await
                                .unwrap_or_else(|e| {
                                    println!("{}", e);
                                    vec![]
                                })
                            }
                        ));
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

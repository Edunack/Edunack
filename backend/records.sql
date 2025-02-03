INSERT INTO users VALUES
(x'11a72346d07047b5b927a44520aa7cb5','test','test@test.test',
'$argon2id$v=19$m=19456,t=2,p=1$zsjr8fOiFNtsi0sAmBH+SQ$I4A+FE+gmRYJSqAOFiBMoootHzgyjyFJhoH+MQ7S844', 1);

INSERT INTO categories VALUES
(x'20f6a6bf0e1d4e84b92e2f2272ab0443'),
(x'417050bafddc4ea4a374038ed4139124'),
(x'0e3fd0a420c64c998a57a00feb819d41'),
(x'46ff9a54349642e7943ae9aef2d1fb0f');

INSERT INTO category_translations VALUES
(x'20f6a6bf0e1d4e84b92e2f2272ab0443', 'en', 'C++'),
(x'417050bafddc4ea4a374038ed4139124', 'en', 'Rust'),
(x'0e3fd0a420c64c998a57a00feb819d41', 'en', 'PHP'),
(x'46ff9a54349642e7943ae9aef2d1fb0f', 'en', 'Embroidery'),
(x'46ff9a54349642e7943ae9aef2d1fb0f', 'pl', 'Haft');

INSERT INTO course_mediums VALUES (0), (1);

INSERT INTO course_medium_translations VALUES
(0, 'en', 'web course'),
(0, 'pl', 'kurs WWW'),
(1, 'en', 'video'),
(1, 'pl', 'wideo');

-- INSERT INTO courses VALUES
-- (x'aefb970ed2c440de92aebfa6908bde6e', x'20f6a6bf0e1d4e84b92e2f2272ab0443', 'w3schools', 0),
-- (x'ae48110e5208446d946dbce1394091ab', x'20f6a6bf0e1d4e84b92e2f2272ab0443', 'learncpp', 0),
-- (x'84bf4c652bcf4bc7aac66a567222cc67', x'0e3fd0a420c64c998a57a00feb819d41', 'w3schools', 0);

INSERT INTO course_translations VALUES
(x'aefb970ed2c440de92aebfa6908bde6e', 'en', 'Learn C++'),
(x'ae48110e5208446d946dbce1394091ab', 'en', 'Learn C++'),
(x'84bf4c652bcf4bc7aac66a567222cc67', 'en', 'Learn PHP'),
(x'84bf4c652bcf4bc7aac66a567222cc67', 'pl', 'ucz PHP');

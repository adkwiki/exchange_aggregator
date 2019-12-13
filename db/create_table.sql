CREATE TABLE cache(
    id serial PRIMARY KEY,
    exchange_id integer NOT NULL,
    created_at timestamp NOT NULL,
    ob_cache jsonb NOT NULL
);

insert into cache (exchange_id, created_at, ob_cache) values (1, now(), '{"spam": 0.001, "ham": [3, 5, 8, 11]}'); 
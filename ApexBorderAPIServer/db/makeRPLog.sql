CREATE TABLE public."RPLog" (
    id SERIAL NOT NULL,
    date text COLLATE pg_catalog."default" NOT NULL,
    season integer NOT NULL,
    origin integer[] NOT NULL,
    ps integer[] NOT NULL,
    xbox integer[] NOT NULL,
    CONSTRAINT "RPLog_pkey" PRIMARY KEY (id)
);

TABLESPACE pg_default;

ALTER TABLE public."RPLog"
    OWNER to {user};
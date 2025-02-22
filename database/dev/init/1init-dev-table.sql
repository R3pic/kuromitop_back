\c dev

SET ROLE yehwan;

CREATE SCHEMA IF NOT EXISTS music;
CREATE SCHEMA IF NOT EXISTS member;
CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE IF NOT EXISTS music.info (
    id          VARCHAR(100)    NOT NULL,
    title       VARCHAR(30)     NOT NULL,
    artist      VARCHAR(30)     NOT NULL,
    thumbnail   VARCHAR(100)    NOT NULL,
    created_at  TIMESTAMPTZ     NOT NULL    DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS member.user (
    id              VARCHAR(100)    NOT NULL    UNIQUE,
    display_name    VARCHAR(100)    NOT NULL,
    thumbnail       VARCHAR(150)    NULL,
    introduction    VARCHAR(100)    NULL,
    created_at      TIMESTAMPTZ     NOT NULL    DEFAULT now(),
    updated_at      TIMESTAMPTZ     NOT NULL    DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS auth.token (
    id               INTEGER                    GENERATED ALWAYS AS IDENTITY,
    user_id          VARCHAR(255)   NOT NULL    UNIQUE,
    access_token     VARCHAR(255)   NULL,
    refresh_token    VARCHAR(255)   NULL,
    created_at       TIMESTAMPTZ    NOT NULL    DEFAULT now(),
    updated_at       TIMESTAMPTZ    NOT NULL    DEFAULT now()
);

CREATE TABLE IF NOT EXISTS member.bundle (
    id              UUID            NOT NULL,
    user_id         VARCHAR(100)    NOT NULL,
    title           VARCHAR(20)     NOT NULL,
    is_private      BOOLEAN         NOT NULL,
    created_at      TIMESTAMPTZ     NOT NULL    DEFAULT now(),
    updated_at      TIMESTAMPTZ     NOT NULL    DEFAULT now(),
    PRIMARY KEY (id),
    CONSTRAINT bundle_user_id_fk FOREIGN KEY (user_id) REFERENCES member.user(id)
);

CREATE TABLE IF NOT EXISTS music.bundle_tracks (
    id              INTEGER         NOT NULL    GENERATED ALWAYS AS IDENTITY,
    music_id        VARCHAR(100)    NOT NULL,
    bundle_id       UUID            NOT NULL,
    created_at      TIMESTAMPTZ     NOT NULL    DEFAULT now(),
    updated_at      TIMESTAMPTZ     NOT NULL    DEFAULT now(),
    PRIMARY KEY (id),
    CONSTRAINT  unique_bundle_tracks        UNIQUE (music_id, bundle_id),
    CONSTRAINT  bundle_tracks_music_id_fk   FOREIGN KEY (music_id)  REFERENCES music.info(id),
    CONSTRAINT  bundle_tracks_bundle_id_fk  FOREIGN KEY (bundle_id) REFERENCES member.bundle(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS member.comment (
    id                      INTEGER                     GENERATED ALWAYS AS IDENTITY,
    bundle_tracks_fk        INTEGER         NOT NULL,
    content                 VARCHAR(250)    NOT NULL,
    created_at              TIMESTAMPTZ     NOT NULL    DEFAULT now(),
    PRIMARY KEY (id),
    CONSTRAINT  comment_bundle_music_fk FOREIGN KEY (bundle_tracks_fk) REFERENCES music.bundle_tracks(id) ON DELETE CASCADE
);
\c dev

SET ROLE yehwan;

CREATE SCHEMA IF NOT EXISTS music;
CREATE SCHEMA IF NOT EXISTS member;
CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE IF NOT EXISTS music.info (
    music_id    INTEGER GENERATED ALWAYS AS IDENTITY,
    external_id VARCHAR(30)     NOT NULL,
    title       VARCHAR(30)     NOT NULL,
    artist      VARCHAR(30)     NOT NULL,
    thumbnail   VARCHAR(100)    NOT NULL,
    PRIMARY KEY (music_id)
);

CREATE TABLE IF NOT EXISTS member.user (
    user_no     INTEGER GENERATED ALWAYS AS IDENTITY,
    username    VARCHAR(20) NOT NULL    UNIQUE,
    login_type  SMALLINT    NOT NULL,
    PRIMARY KEY (user_no)
);

CREATE TABLE IF NOT EXISTS member.profile (
    profile_id          INTEGER GENERATED ALWAYS AS IDENTITY,
    user_no             INTEGER         NOT NULL,
    nickname            VARCHAR(10)     NULL,
    thumbnail_url       VARCHAR(100)    NULL,
    introduction        VARCHAR(30)     NULL,
    email               VARCHAR(128)    NULL,
    birthday            VARCHAR(10)     NULL,
    create_at   TIMESTAMPTZ     NOT NULL    DEFAULT now(),
    PRIMARY KEY (profile_id),
    CONSTRAINT profile_user_no_fk FOREIGN KEY (user_no) REFERENCES member.user(user_no)
);

CREATE TABLE IF NOT EXISTS member.bundle (
    uuid        UUID            NOT NULL    DEFAULT gen_random_uuid(),
    user_no     INTEGER         NOT NULL,
    title       VARCHAR(20)     NOT NULL,
    is_private     BOOLEAN      NOT NULL,
    create_at   TIMESTAMPTZ     NOT NULL    DEFAULT now(),
    PRIMARY KEY (uuid),
    CONSTRAINT bundle_user_no_fk FOREIGN KEY (user_no) REFERENCES member.user(user_no)
);

CREATE TABLE IF NOT EXISTS music.bundle_music (
    bundle_music_pk INTEGER         NOT NULL    GENERATED ALWAYS AS IDENTITY,
    music_id        INTEGER         NOT NULL,
    bundle_id       UUID            NOT NULL,
    create_at       TIMESTAMPTZ     NOT NULL    DEFAULT now(),
    PRIMARY KEY (bundle_music_pk),
    CONSTRAINT  bundle_music_music_id_fk FOREIGN KEY (music_id) REFERENCES music.info(music_id),
    CONSTRAINT  bundle_music_bundle_id_fk FOREIGN KEY (bundle_id) REFERENCES member.bundle(uuid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS member.comment (
    comment_id INTEGER                     GENERATED ALWAYS AS IDENTITY,
    bundle_music_fk INTEGER         NOT NULL,
    comment     VARCHAR(250)    NOT NULL,
    create_at   TIMESTAMPTZ     NOT NULL    DEFAULT now(),
    PRIMARY KEY (comment_id),
    CONSTRAINT  comment_bundle_music_fk FOREIGN KEY (bundle_music_fk) REFERENCES music.bundle_music(bundle_music_pk) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS auth.password (
    password_id     INTEGER GENERATED ALWAYS AS IDENTITY,
    user_no         INTEGER         NOT NULL,
    password        VARCHAR(128)    NOT NULL,
    update_at       DATE            NOT NULL    DEFAULT now(),
    PRIMARY KEY (password_id),
    CONSTRAINT password__user_no_fk FOREIGN KEY(user_no) REFERENCES member.user(user_no)
);

CREATE TABLE IF NOT EXISTS auth.social_login (
    social_login_id INTEGER GENERATED ALWAYS AS IDENTITY,
    user_no         INTEGER         NOT NULL,
    social_code     SMALLINT        NOT NULL, -- (1). spotify (2). google (3). discord
    external_id     VARCHAR(64)     NOT NULL,
    access_token    VARCHAR(256)    NOT NULL,
    PRIMARY KEY (social_login_id),
    CONSTRAINT social_login__user_no_fk FOREIGN KEY(user_no) REFERENCES member.user(user_no)
);
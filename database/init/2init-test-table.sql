\c test
SET ROLE yehwan;

CREATE SCHEMA IF NOT EXISTS music;
CREATE SCHEMA IF NOT EXISTS member;
CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE IF NOT EXISTS music.info (
    music_id            INTEGER         NOT NULL    GENERATED ALWAYS AS IDENTITY,
    external_url        VARCHAR(30)     NOT NULL    UNIQUE,
    title               VARCHAR(30)     NOT NULL,
    artist              VARCHAR(30)     NOT NULL,
    thumbnail           VARCHAR(100)    NOT NULL,
    PRIMARY KEY (music_id)
);

INSERT INTO music.info (external_url, title, artist, thumbnail) VALUES
    ('https://example1.com', '노래제목1', '아티스트1', 'https://thumbnail.com'),
    ('https://example2.com', '노래제목2', '아티스트2', 'https://thumbnail.com'),
    ('https://example3.com', '노래제목3', '아티스트3', 'https://thumbnail.com');

CREATE TABLE IF NOT EXISTS member.user (
    user_no         INTEGER         NOT NULL    GENERATED ALWAYS AS IDENTITY,
    username        VARCHAR(20)     NOT NULL    UNIQUE,
    login_type      SMALLINT        NOT NULL,
    PRIMARY KEY (user_no)
);

INSERT INTO member.user (username, login_type) VALUES
    ('UserA', '0'),
    ('UserB', '0'),
    ('UserC', '0');

CREATE TABLE IF NOT EXISTS member.profile (
    profile_id      INTEGER         NOT NULL    GENERATED ALWAYS AS IDENTITY,
    user_no         INTEGER         NOT NULL,
    nickname        VARCHAR(10)     NULL,
    thumbnail_url   VARCHAR(100)    NULL,
    introduction    VARCHAR(30)     NULL,
    email           VARCHAR(128)    NULL,
    birthday        VARCHAR(10)     NULL,
    create_at   TIMESTAMPTZ         NOT NULL    DEFAULT now(),
    PRIMARY KEY (profile_id),
    CONSTRAINT profile_user_no_fk FOREIGN KEY (user_no) REFERENCES member.user(user_no) ON DELETE CASCADE
);

INSERT INTO member.profile (user_no, nickname, thumbnail_url, introduction, email, birthday) VALUES
    (1, 'ANickname', NULL, NULL, NULL, NULL),
    (2, NULL, NULL, NULL, NULL, NULL),
    (3, NULL, NULL, NULL, NULL, NULL);

CREATE TABLE IF NOT EXISTS member.bundle (
    uuid            UUID            NOT NULL    DEFAULT gen_random_uuid(),
    user_no         INTEGER         NOT NULL,
    title           VARCHAR(20)     NOT NULL,
    is_private      BOOLEAN         NOT NULL,
    create_at       TIMESTAMPTZ     NOT NULL    DEFAULT now(),
    PRIMARY KEY (uuid),
    CONSTRAINT bundle_user_no_fk FOREIGN KEY (user_no) REFERENCES member.user(user_no) ON DELETE CASCADE
);

INSERT INTO member.bundle (uuid, user_no, title, is_private) VALUES
    ('45c30b73-08c3-4458-82a0-8fa00f74dd18', 1, 'A 테스트 꾸러미1', false),
    ('45c30b73-08c3-4458-82a0-8fa00f74dd19', 1, 'A 테스트 비밀 꾸러미1', true),
    ('45c30b73-08c3-4458-82a0-8fa00f74dd20', 2, 'B 테스트 비밀 꾸러미1', true);

CREATE TABLE IF NOT EXISTS music.bundle_music (
    bundle_music_pk INTEGER         NOT NULL    GENERATED ALWAYS AS IDENTITY,
    music_id        INTEGER         NOT NULL,
    bundle_id       UUID            NOT NULL,
    create_at       TIMESTAMPTZ     NOT NULL    DEFAULT now(),
    PRIMARY KEY (bundle_music_pk),
    CONSTRAINT bundle_music_music_id_fk     FOREIGN KEY (music_id) REFERENCES music.info(music_id),
    CONSTRAINT bundle_music_bundle_id_fk    FOREIGN KEY (bundle_id) REFERENCES member.bundle(uuid) ON DELETE CASCADE,
    CONSTRAINT bundle_music_unique          UNIQUE (music_id, bundle_id)
);

INSERT INTO music.bundle_music (music_id, bundle_id)
VALUES
    (1, (SELECT uuid FROM member.bundle WHERE user_no = 1 AND title = 'A 테스트 꾸러미1')),
    (2, (SELECT uuid FROM member.bundle WHERE user_no = 1 AND title = 'A 테스트 꾸러미1')),
    (3, (SELECT uuid FROM member.bundle WHERE user_no = 1 AND title = 'A 테스트 비밀 꾸러미1'));

CREATE TABLE IF NOT EXISTS member.comment (
    comment_id      INTEGER         NOT NULL    GENERATED ALWAYS AS IDENTITY,
    bundle_music_fk INTEGER         NOT NULL,
    comment         VARCHAR(250)    NOT NULL,
    create_at       TIMESTAMPTZ     NOT NULL    DEFAULT now(),
    PRIMARY KEY (comment_id),
    CONSTRAINT  comment_bundle_music_fk FOREIGN KEY (bundle_music_fk) REFERENCES music.bundle_music(bundle_music_pk) ON DELETE CASCADE
);

INSERT INTO member.comment (bundle_music_fk, comment) VALUES
    (1, '노래가 좋다'),
    (1, '노래가 참 좋다'),
    (3, '이노래엔 사연이 있다');

CREATE TABLE IF NOT EXISTS auth.password (
    password_id     INTEGER         NOT NULL    GENERATED ALWAYS AS IDENTITY,
    user_no         INTEGER         NOT NULL,
    password        VARCHAR(128)    NOT NULL,
    update_at       DATE            NOT NULL    DEFAULT now(),
    PRIMARY KEY (password_id),
    CONSTRAINT password__user_no_fk FOREIGN KEY(user_no) REFERENCES member.user(user_no) ON DELETE CASCADE
);

INSERT INTO auth.password (user_no, password) VALUES
    (1, 'testPassword1'),
    (2, 'testPassword2'),
    (3, 'testPassword3');

CREATE TABLE IF NOT EXISTS auth.social_login (
    social_login_id INTEGER         NOT NULL    GENERATED ALWAYS AS IDENTITY,
    user_no         INTEGER         NOT NULL,
    social_code     SMALLINT        NOT NULL, -- (1). spotify (2). google (3). discord
    external_id     VARCHAR(64)     NOT NULL,
    access_token    VARCHAR(256)    NOT NULL,
    PRIMARY KEY (social_login_id),
    CONSTRAINT social_login__user_no_fk FOREIGN KEY(user_no) REFERENCES member.user(user_no)
);
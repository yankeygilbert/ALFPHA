CREATE DATABASE lizodb;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    user_uid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (), first_name VARCHAR(50) NOT NULL, last_name VARCHAR(50) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL, verification_token VARCHAR(255), is_verified BOOLEAN NOT NULL DEFAULT false, reset_password_token VARCHAR(255), reset_password_token_expiry TIMESTAMP, is_admin BOOLEAN NOT NULL DEFAULT false, created_at TIMESTAMP NOT NULL DEFAULT now(), updated_at TIMESTAMP NOT NULL DEFAULT now()
);

ALTER TABLE users ALTER verification_token TYPE VARCHAR(255);

ALTER TABLE users ALTER reset_password_token TYPE VARCHAR(255);

alter table users alter verification_token drop not null;

INSERT INTO
    users (
        first_name, last_name, email, password_hash, verification_token, is_verified, reset_password_token, reset_password_token_expiry, is_admin
    )
VALUES (
        'admin', 'super', 'admin@lizo.com', '$2a$10$LfrOabCauTP7s1ZYQxxlmuFDHOMARUsotNbTvNhWXX2fEIlcXntI.', null, true, null, null, true
    );

CREATE TABLE files (
    file_uid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (), title VARCHAR(255) NOT NULL, description TEXT, file_path VARCHAR(255) NOT NULL, num_downloads INTEGER NOT NULL DEFAULT 0, num_emails_sent INTEGER NOT NULL DEFAULT 0, created_at TIMESTAMP NOT NULL DEFAULT now(), updated_at TIMESTAMP NOT NULL DEFAULT now(), user_id UUID REFERENCES users (user_uid) ON DELETE CASCADE
);

CREATE FUNCTION check_user_is_admin() RETURNS TRIGGER 
AS 
$$
BEGIN
	IF EXISTS (
	    SELECT 1
	    FROM users
	    WHERE
	        user_uid = NEW.user_id
	        AND is_admin = true
	) THEN
	RETURN NEW;
	ELSE RAISE EXCEPTION 'Only admin users can upload files';
END
	IF;
END;
$$
LANGUAGE
plpgsql; 

CREATE TRIGGER enforce_user_is_admin BEFORE
INSERT
    ON files FOR EACH ROW
EXECUTE FUNCTION check_user_is_admin ();

DROP TRIGGER IF EXISTS enforce_user_is_admin ON files CASCADE;
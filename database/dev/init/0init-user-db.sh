#!/bin/bash

set -e

# Check if user exists
USER_EXISTS=$(psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'")
if [ -z "$USER_EXISTS" ]; then
    echo "Creating user $DB_USER..."
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
        CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
        GRANT ALL ON DATABASE $POSTGRES_DB TO $DB_USER;
EOSQL
else
    echo "User $DB_USER already exists. Skipping creation."
fi

DB_EXISTS=$(psql -tAc "SELECT 1 FROM pg_database WHERE datname='dev'")
if [ -z "$DB_EXISTS" ]; then
    echo "Creating database test..."
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
        CREATE DATABASE dev
        WITH OWNER = 'yehwan'
        ENCODING = 'UTF8'
        LC_COLLATE = 'C'
        LC_CTYPE = 'C'
        TEMPLATE = template0;
        GRANT ALL ON DATABASE dev TO yehwan GRANTED BY postgres;
EOSQL
else
    echo "Database dev already exists. Skipping creation."
fi
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
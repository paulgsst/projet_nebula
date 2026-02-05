#!/bin/sh
set -e

echo "Waiting for postgres..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "Postgres is ready!"

echo "Running migrations..."
node ace migration:run --force

echo "Running seeders..."
node ace db:seed

echo "Starting server..."
exec node ace serve --watch

#!/bin/bash
set -e

# Check if the database exists, or setup the database if it doesn't, before starting the server.
# Note: Update or remove database-related commands according to your application's needs.
# Example:
# rails db:exists && rails db:migrate || rails db:setup

exec "$@"

# Inventory & Shop Management System

A small inventory and point-of-sale system. Node.js and Express serve a REST API over a
Microsoft SQL Server database, with a single-page vanilla JavaScript frontend.

## Features

- Products, suppliers and staff — full create, edit and delete
- Purchase entry, with stock increased automatically by a database trigger
- Sales and billing, with stock checked and reduced at the point of sale
- Low-stock flagging against a per-product reorder level
- Reports: daily sales, current stock value, low stock, purchases by supplier

## Built with

Node.js, Express, mssql, Microsoft SQL Server, and plain HTML/CSS/JavaScript.

## Project structure

    server.js            Express API and static file server
    database/setup.sql   Schema, trigger and seed data
    frontend/index.html  The whole user interface
    .env.example         Template for your local credentials

## Running it locally

You need Node.js and a running SQL Server instance. On macOS, SQL Server runs in Docker:

    docker run -d --name sqlserver --platform linux/amd64 \
      -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourPassword123" \
      -p 1433:1433 mcr.microsoft.com/mssql/server:2022-latest

Create the database by running `database/setup.sql` against that instance.

Then install and configure:

    npm install
    cp .env.example .env

Open `.env` and set `DB_PASSWORD` to the password you gave the container. Start the server:

    node server.js

Open http://localhost:3000 in a browser.

## Notes

`.env` holds the database password and is excluded from version control. Copy
`.env.example` and fill in your own values on each machine.

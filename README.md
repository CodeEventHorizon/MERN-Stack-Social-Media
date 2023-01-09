# MERN stack

## Installations

[Download MongoDB v5.0.4](https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-5.0.3-signed.msi)
[Download Node.js v16.13.0](https://nodejs.org/download/release/v16.13.0/node-v16.13.0-x64.msi)

## How to install?

[Install MongoDB](https://youtu.be/3wqzr-GJoS0)
[Install Node.js](https://youtu.be/3F5IaPqj7ds)

## Running the database

To run the database

MongoDB must be installed on the computer

[Install MongoDB](https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-5.0.3-signed.msi)

MongoDB by default stores databases in the directory where it is installed.

So the following directory needs to be created

### `C:\data\db`

Following will do that:

### `cd ~`

### `mkdir data && cd data && mkdir db`

by default MongoDB database runs on port 27017
[http://localhost:27017](http://localhost:27017)

To run the database manually Type the following in the cd after adding mongo bin files to the PATH

### `mongod`

Then type

### `mongo`

To check the port where MongoDB is running, just in case

## Running the back-end

To run the backend

Use the following to install node dependencies:

### `cd server`

### `npm i`

Type the following to run the server:

### `npm start`

[server.js] contains the way that creates the back-end server on port 8000
[http://localhost:8000]

## Running the front-end in development mode

To start the front-end

Use the following to install node dependencies:

### `cd client`

### `npm i`

Type the following to run the client in development mode:

### `npm run dev`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

# Dependencies

For simplicity refer to `package.json` in both server and client folders and check under `"dependencies"`

# NOTE

Server, Client and Database are separate processes and they all need to run for the website to work the way it is intended to work. In this case they need to run on the single computer, as they are all using localhost

First run the database,
Second run the server,
Finally run the client.

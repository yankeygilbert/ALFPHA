# Lizo File Server Application

This is a PERN (PostgreSQL, Express, React, Node.js) application that allows users to upload, download, and delete files from a centralized server.

## Installation

To install and run the application, follow these steps:

1. Clone this repository to your local machine.
2. Install the required dependencies by running `npm install` in both the `client` and `server` directories.
3. Create an env from the sample.env and where `PORT` is not required in deployment leave it as `""`. Example
```
CLIENT_PORT = ""
SERVER_PORT = ""
```
4. Create a PostgreSQL database and configure the connection string in `.env` file in `server` directory. Example:

```
DB_NAME=your-database-name
DB_USER=your-database-username
DB_PASSWORD=your-database-password
DB_HOST=your-database-host
DB_PORT=your-database-port
```

5. Run the database migrations by running the `database.sql` on the database service of choice.
6. Start the server by running `npm run dev` in the `server` directory.
7. Start the client by running `npm run dev` in the `client` directory.

<b><i>NB: Recommended you run the applications as docker containers. Docker files are in the various directories and a Makefile would help to build the Docker Imagees</i></b>

## Usage

The file server application can be accessed through a web browser.

To access the client, navigate to `http://localhost:5173` in your web browser.

From there, admin can upload files by clicking on the "Upload File" button and selecting a file from your local machine. You can download a file by clicking on its name in the file list. You can delete a file by clicking on the "Delete" button next to its name in the file list.

Other users can view, download and send the files via email after signing up.

## Configuration

The file server application can be configured by editing the `.env` file in the `server` directory. Here are the available configuration options:

- `PORT`: The port number that the server listens on (default: 8000).
- `UPLOAD_DIR`: The directory where uploaded files are stored (default: "./uploads").
- `SECRET`: The secret is a unique self generated string used to encrypt tokens, etc.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
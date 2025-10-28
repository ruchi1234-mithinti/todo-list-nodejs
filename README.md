# Todo List - Node.js Application

## Project Description

This is a simple and interactive To-Do List web application built using JavaScript and Node.js. The application allows users to manage their daily tasks efficiently with features to add, view, update, and delete tasks.

## Features

- Add new tasks to your to-do list
- View all tasks in a clean interface
- Mark tasks as complete/incomplete
- Delete tasks when no longer needed
- Responsive design for mobile and desktop
- RESTful API architecture

## Technologies Used

- **Backend**: Node.js with Express.js
- **Frontend**: HTML, CSS, and JavaScript
- **Storage**: JSON file-based storage (can be extended to use databases)

## Project Structure

```
todo-list-nodejs/
├── server.js           # Main server file
├── package.json        # Project dependencies
├── public/             # Static files
│   ├── index.html      # Main HTML file
│   ├── styles.css      # CSS styles
│   └── app.js          # Frontend JavaScript
└── README.md           # Project documentation
```

## Installation and Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Steps to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/ruchi1234-mithinti/todo-list-nodejs.git
   cd todo-list-nodejs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Docker Setup

### Building Docker Image

To containerize this application using Docker, you will need to create a Dockerfile. Follow these steps:

1. Create a `Dockerfile` in the project root directory with the following content:
   ```dockerfile
   FROM node:14
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. Build the Docker image:
   ```bash
   docker build -t todo-list-nodejs .
   ```

3. Run the Docker container:
   ```bash
   docker run -p 3000:3000 todo-list-nodejs
   ```

4. Access the application at:
   ```
   http://localhost:3000
   ```

### Docker Compose (Optional)

For easier container management, you can create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  todo-app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
```

Run with:
```bash
docker-compose up
```

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Future Enhancements

- User authentication and authorization
- Database integration (MongoDB/PostgreSQL)
- Task categories and priorities
- Due dates and reminders
- Search and filter functionality
- Multi-user support

## Contributing

Feel free to fork this repository and submit pull requests for any improvements.

## License

This project is open source and available under the MIT License.

## Author

Ruchitha (ruchi1234-mithinti)

---

**Note**: Docker implementation details are provided above. You can proceed with creating the Dockerfile and container images as per your requirements.

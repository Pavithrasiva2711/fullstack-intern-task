# TemplateHub — Mini SaaS Template Store

A full-stack web application that allows users to register, log in, explore website templates, and save their favorite templates.

**Live Demo:** https://templatehub-frontend.onrender.com  
**Backend API:** https://fullstack-intern-task-eljc.onrender.com/api  
**GitHub Repository:** https://github.com/Pavithrasiva2711/fullstack-intern-task

## Features

- User registration and login
- Secure password hashing using bcrypt
- JWT-based authentication
- Browse available templates
- View individual template details
- Add and remove favorite templates
- View saved templates in My Favorites
- Search and filter templates by category
- Responsive user interface
- Persistent favorites for registered users

## Tech Stack

**Frontend**
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router

**Backend**
- Node.js
- Express.js
- JWT
- bcryptjs

**Database**
- PostgreSQL for the deployed application
- SQLite for local development
- Knex.js for database queries and migrations

## Project Structure

```text
fullstack-intern-task/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── api.js
│   ├── package.json
│   └── .env
├── server/
│   ├── middleware/
│   ├── migrations/
│   ├── routes/
│   ├── database.js
│   ├── migrate.js
│   ├── seed.js
│   └── server.js
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js and npm
- Git

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Pavithrasiva2711/fullstack-intern-task.git
cd fullstack-intern-task
```

### 2. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
JWT_SECRET=replace_with_a_long_random_secret
```

For local development, the application uses SQLite by default when `DATABASE_URL` is not set.

For PostgreSQL deployment, configure `DATABASE_URL` in the server environment with your database connection string. Keep all secrets private and never commit `.env` files.

### 3. Set up the database

Run the migrations:

```bash
node migrate.js
```

Seed the sample templates:

```bash
node seed.js
```

### 4. Start the backend

```bash
npm run dev
```

The backend runs at:

`http://localhost:5000`

### 5. Configure and start the frontend

Open a new terminal from the project root:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually:

`http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in |
| GET | `/api/templates` | List templates |
| GET | `/api/templates/:id` | Get template details |
| GET | `/api/favorites` | Get the logged-in user's favorites |
| POST | `/api/favorites/:templateId` | Add a favorite |
| DELETE | `/api/favorites/:templateId` | Remove a favorite |

Favorite endpoints require JWT authentication.

## Deployment

The frontend is deployed on Render as a Static Site, and the backend is deployed as a Web Service. PostgreSQL is used for the deployed database.

- **Frontend:** https://templatehub-frontend.onrender.com
- **Backend health check:** https://fullstack-intern-task-eljc.onrender.com/api/health

## Author

**Pavithra S**

GitHub: https://github.com/Pavithrasiva2711
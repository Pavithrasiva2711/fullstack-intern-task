# TemplateHub — Mini SaaS Template Store

A full-stack web application that allows users to register, log in, explore website templates, and save their favorite templates.

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
- SQLite
- Knex.js

## Project Structure

```text
TemplateHub/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── api.js
│   └── package.json
├── server/
│   ├── middleware/
│   ├── migrations/
│   ├── routes/
│   ├── database.js
│   ├── migrate.js
│   ├── seed.js
│   ├── server.js
│   └── package.json
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

Create a `.env` file inside the `server` folder:

```env
PORT=5000
JWT_SECRET=replace_with_a_long_random_secret
```

Use a strong, private JWT secret.

### 3. Set up the database

Run the database migrations:

```bash
npm run migrate
```

Seed the sample templates:

```bash
npm run seed
```

### 4. Start the backend

```bash
npm run dev
```

The backend runs at `http://localhost:5000`.

### 5. Configure and start the frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL shown in the terminal, usually `http://localhost:5173`.

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

## Author

**Pavithra S**

GitHub: [Pavithrasiva2711](https://github.com/Pavithrasiva2711)
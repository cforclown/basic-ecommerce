**Basic Ecommerce Backend**

---

### Introduction

Welcome to the Basic E-commerce API! This API is built using Node.js, Express, Prisma, Postgres and TypeScript.

### Getting started

Before you begin, make sure you have Node.js installed on your machine. Then, follow these steps to set up the project:

1. Clone the repository: `https://github.com/cforclown/basic-ecommerce`
2. Navigate to the project directory: `cd basic-ecommerce`
3. Install dependencies: `npm install`
4. Set up your environment variables by creating a `.env` file and filling in the necessary details. I have already added a `.env.example` file check that out and replace the values.
5. Run the migration to create your database schema: `npx prisma migrate dev`
6. Run the seed command to add initial data: `npx prisma db seed`
7. Start the server: `npm run dev`
8. You're ready to explore the API!

### API Routes and Endpoints

#### Authentication

- **POST /api/auth/signup**
  - Description: Register a new user.
  - Request Body:
    ```json
    {
      "name": "example",
      "email": "example@example.com",
      "password": "password123"
    }
    ```

- **POST /api/auth/signin**
  - Description: Log in as an existing user.
  - Request Body:
    ```json
    {
      "email": "example@example.com",
      "password": "password123"
    }
    ```

#### Products

#### Cart

#### Admin

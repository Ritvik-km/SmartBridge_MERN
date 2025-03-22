## Overview

This project consists of a landing page built with React.js and Tailwind CSS, along with an Express.js backend for handling user data. The frontend includes a product display, responsive navigation, and a product details page. The backend provides API routes to manage users.

# Features

1. Frontend (React.js + Tailwind CSS)

Landing Page

Hero section with a title and description.

Product section displaying multiple products with images, names, and prices.

Responsive navbar.

Footer with social media links.

Product Details Page

Displays detailed information when a product is clicked.

2. Backend (Express.js)

Express Server

Runs on port 5000.

Middleware to parse JSON requests.

API Endpoints

GET /welcome → Responds with { message: "Welcome to Express!" }.

User management routes with an in-memory array:

GET /users → Fetch all users.

POST /users → Add a new user.

PUT /users/:id → Update a user by ID.

DELETE /users/:id → Remove a user by ID.
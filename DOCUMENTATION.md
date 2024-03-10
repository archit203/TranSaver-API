# API Documentation

Welcome to the API documentation for TranSaver API

## Base URL

The base URL for all endpoints if you are running on your local machine:

```
http://localhost:3000
```
The base URL for all endpoints if you are using deployed serive:

```
https://transaver-api.onrender.com
```

## Authentication

Authentication is required for accessing certain endpoints. You need to include a valid JWT token in the Authorization header of your requests.

## Endpoints

### Register User

- **URL**: `/register`
- **Method**: POST
- **Description**: Register a new user with a username and password.
- **Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```
- **Responses**:
  - `201 Created`: User successfully registered.
  - `400 Bad Request`: Invalid request body.

### Login User

- **URL**: `/login`
- **Method**: POST
- **Description**: Authenticate and generate a JWT token for an existing user.
- **Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```
- **Responses**:
  - `201 Created`: User successfully logged in. Returns JWT token.
  - `401 Unauthorized`: Invalid credentials.

### Get Transactions

- **URL**: `/transactions`
- **Method**: GET
- **Description**: Get transactions within a specified date range.
- **Query Parameters**:
  - `start_date`: Start date of the range (YYYY-MM-DD).
  - `end_date`: End date of the range (YYYY-MM-DD).
- **Authorization Header**: Bearer [JWT Token]
- **Responses**:
  - `200 OK`: Returns transactions within the specified date range.
  - `401 Unauthorized`: Missing or invalid token.
  - `404 Not Found`: No transactions found.

### Create Transaction

- **URL**: `/transactions`
- **Method**: POST
- **Description**: Add a new transaction.
- **Authorization Header**: Bearer [JWT Token]
- **Request Body**:
```json
{
  "income": "number",
  "expenses": "number",
  "description": "string",
  "date": "string (YYYY-MM-DD)"
}
```
- **Responses**:
  - `201 Created`: Transaction successfully created.
  - `400 Bad Request`: Invalid request body.

### Get Transaction Summary

- **URL**: `/transactions/summary`
- **Method**: GET
- **Description**: Get summary statistics of all transactions for the authenticated user.
- **Authorization Header**: Bearer [JWT Token]
- **Responses**:
  - `200 OK`: Returns summary statistics (total income, total expenses, total savings).
  - `401 Unauthorized`: Missing or invalid token.
  - `404 Not Found`: No transactions found.

### Delete Transaction

- **URL**: `/transactions/:id`
- **Method**: DELETE
- **Description**: Delete a transaction by its ID.
- **Authorization Header**: Bearer [JWT Token]
- **Responses**:
  - `200 OK`: Transaction successfully deleted.
  - `401 Unauthorized`: Missing or invalid token.
  - `404 Not Found`: Transaction not found.

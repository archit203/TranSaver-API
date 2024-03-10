# Instructions to Run the Project

Follow these steps to set up and run the project:

1. **Clone the Repository:**
   - Clone the git repository into your local system.

2. **Install Node.js:**
   - Make sure you have Node.js installed on your machine.

3. **Install Dependencies:**
   - Navigate to the project directory in your terminal.
   - Run the following command to install dependencies:
     ```
     npm install
     ```

4. **Set up Environment Variables:**
   - Add an `.env` file to the project root directory.
   - Configure the following environment variables in the `.env` file:
     ```
     DATABASE_URL=your_database_url
     JWT_SECRET=your_jwt_secret
     NODE_TLS_REJECT_UNAUTHORIZED=0 (if using online PostgreSQL database)
     ```
   - Ensure that you allow access from anywhere to your database.

5. **Create Database Tables:**
   - Run the following commands to create necessary database tables:
     ```
     node backend/database/functions.js createUserTable
     node backend/database/functions.js createTransactionsTable
     ```

6. **Run Server:**
   - To run the server, execute the following command:
     ```
     node backend/server.js
     ```

7. **Explore API Documentation:**
   - Refer to the `DOCUMENTATION.md` file for usage instructions of the API.

8. **Test Using Postman:**
   - Test the API endpoints using a tool like Postman.
   - Ensure you provide necessary authentication tokens as required.

9. **Run Tests with Cypress:**
   - Open another terminal window.
   - Execute the following command to run tests using Cypress:
     ```
     npx cypress run --spec cypress/e2e/server.cy.js
     ```

10. **View Test Results:**
    - View the test results in the Cypress Test Runner interface.

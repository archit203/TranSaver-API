const { client } = require("./db");

async function createUserTable() {
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL
            );
        `)
        console.log("User table created successfully!")
    } catch (error) {
        console.error("Error creating user table", error);
    }
}

async function createTransactionTable() {
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL,
                income DECIMAL(10, 2) NOT NULL DEFAULT 0,
                expenses DECIMAL(10, 2) NOT NULL DEFAULT 0,
                savings DECIMAL(10, 2) NOT NULL DEFAULT 0,
                description TEXT,
                date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `)
        console.log("Transaction table created successfully!")
    }catch(error){
        console.log("Error creating transaction table", error);
    }
}

async function createUser(username, password) {
    try {
        await client.query(`
            INSERT INTO users (username, password_hash)
            VALUES ($1, $2)
        `, [username, password]);
        console.log("User created successfully!");
    } catch (error) {
        console.error("Error creating user", error);
    }
}

async function getUser(username){
    try {
        const users = await client.query(`
            SELECT * FROM users WHERE username = $1
        `, [username]);
        return users.rows[0];
    }catch(error){
        console.error("Error getting users", error);
    }
}

async function createTransaction(user_id, income, expenses, savings, description, date){
    try {
        await client.query(`
            INSERT INTO transactions (user_id, income, expenses, savings, description, date)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [user_id, income, expenses, savings, description, date]);
        console.log("Transaction created successfully!");
    }catch(error){
        console.error("Error creating transaction", error);
    }
}

async function getTransactions(user_id){
    try {
        const transactions = await client.query(`
            SELECT * FROM transactions WHERE user_id = $1
        `, [user_id]);
        return transactions.rows;
    }catch(error){
        console.error("Error getting transactions", error);
    }
}

async function getTransactionById(id){
    try {
        const transaction = await client.query(`
            SELECT * FROM transactions WHERE id = $1
        `, [id]);
        return transaction.rows[0];
    }catch(error){
        console.error("Error getting transaction", error);
    }
}

async function getTransactionByDateAndId(user_id, s_date, e_date){
    try {
        const transactions = await client.query(`
            SELECT * FROM transactions WHERE user_id = $1 AND date BETWEEN $2 AND $3
        `, [user_id, s_date, e_date]);
        return transactions.rows;
    }catch(error){
        console.error("Error getting transactions", error);
    }
}

async function deleteTransaction(id){
    try {
        await client.query(`
            DELETE FROM transactions WHERE id = $1
        `, [id]);
        console.log("Transaction deleted successfully!");
        return "Transaction deleted successfully!";
    }catch(error){
        console.error("Error deleting transaction", error);
        throw error;
    }
}

module.exports = {
    createUser,
    getUser,
    createTransaction,
    getTransactions,
    getTransactionById,
    deleteTransaction,
    getTransactionByDateAndId
}
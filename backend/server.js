const express = require("express");
const { registerUser, registerTransaction } = require("./utils");
const { authenicateUser, generateToken, authenticator } = require("../middlewares/middleware");
const { getTransactions, getTransactionById, deleteTransaction, getTransactionByDateAndId } = require("../database/functions");
const rateLimit = require("express-rate-limit");

// rate limiter middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests"
});



const app = express();
app.use(express.json());
app.use(limiter);

// for signup the user
app.post("/register", async (req,res) => {
    const {username, password} = req.body;
    try {
        const reg = await registerUser(username, password);
        res.status(201).json({message: reg});
    }catch(error){
        console.log(error);
        res.status(400).json({error: "Invalid data"})
    }
})

// for login the user and generate token
app.post("/login", async (req,res) => {
    const {username, password} = req.body;
    const user = await authenicateUser(username, password);
    if(!user){
        res.status(401).json({error: "Unauthorized"});
    }
    const token = generateToken(user);
    res.status(201).json({token: token});
})

// for getting the transactions between specified dates
app.get("/transactions",authenticator,async (req,res) => {
    const transactions = await getTransactionByDateAndId(req.user.id, req.query.start_date, req.query.end_date);
    if(transactions.length === 0){
        res.status(404).json({error: "No transactions found"});
    }
    res.status(200).json({transactions: transactions});
})


// for adding the transactions in the database
app.post("/transactions", authenticator, async (req, res) => {
    const {income, expenses, description, date} = req.body;
    const savings = income - expenses;
    try {
        const result = await registerTransaction(req.user.id, income, expenses, savings, description, date);
        res.status(201).json({message: result});
    }catch(error){
        console.log(error);
        res.status(400).json({error: "Invalid Data"});
    }
})

// for getting the summary of the transactions
app.get("/transactions/summary", authenticator, async (req,res) => {
    const transactions = await getTransactions(req.user.id);
    if(transactions.length === 0){
        res.status(404).json({error: "No transactions found"});
    }
    let totalIncome = 0, totalExpenses = 0, totalSavings = 0;
    transactions.forEach((transaction) => {
        totalIncome += parseFloat(transaction.income);
        totalExpenses += parseFloat(transaction.expenses);
        totalSavings += parseFloat(transaction.savings);
    });
    res.status(200).json({
        totalIncome: totalIncome,
        totalExpenses: totalExpenses,
        totalSavings: totalSavings
    })
})

// for deleting the transaction
app.delete("/transactions/:id", authenticator, async (req,res) => {
    const transaction = await getTransactionById(req.params.id);
    if(!transaction){
        res.status(404).json({error: "Transaction not found"});
    }
    if(transaction.user_id !== req.user.id){
        res.status(401).json({error: "Unauthorized"});
    }
    try {
        const result = await deleteTransaction(req.params.id);
        res.status(200).json({message: result});
    }catch(error){
        res.status(500).json({error: "Internal Server Error"});
    }
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
})




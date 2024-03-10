const { createUser, createTransaction } = require("../database/functions");
const bcrypt = require("bcrypt");
const zod = require("zod");

const userSchema = zod.object({
    username: zod.string(),
    password: zod.string()
});

const transactionSchema = zod.object({
    user_id: zod.number(),
    income: zod.number(),
    expenses: zod.number(),
    savings: zod.number(),
    description: zod.string(),
    date: zod.string()
});

async function registerUser(username, password){
    const user = userSchema.safeParse({username, password});
    if (!user.success){
        throw new Error("Invalid data");
    }
    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);
    await createUser(username, password_hash);
    return "User created successfully!";
}

async function registerTransaction(user_id, income, expenses, savings, description, date){
    const transaction = transactionSchema.safeParse({user_id, income, expenses, savings, description, date});
    if (!transaction.success){
        throw new Error("Invalid data");
    }
    await createTransaction(user_id, income, expenses, savings, description, date);
    return "Transaction created successfully!";
}

module.exports = {
    registerUser,
    userSchema,
    registerTransaction,
    transactionSchema
}
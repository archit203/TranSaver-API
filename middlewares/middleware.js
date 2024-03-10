const { getUser } = require("../database/functions");
const { userSchema } = require("../backend/server");
const bycrpt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
require('dotenv').config();

async function authenicateUser(username, password){
    const user = await getUser(username);
    if (!user){
        return null
    }
    const isValidPassword = bycrpt.compareSync(password, user.password_hash);
    if(!isValidPassword){
        return null
    }
    return user;
    
}

function generateToken(user){
    return jsonwebtoken.sign({
        id: user.id,
        username: user.username  
    }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
}

function verifyToken(token){
    return jsonwebtoken.verify(token, process.env.JWT_SECRET);
}

async function authenticator(req,res,next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({error: "Unauthorized"});
    }
    const token = authHeader.split(" ")[1];
    try {
        const user = verifyToken(token);
        req.user = user;
        console.log(user);
        next();
    }catch(error){
        console.log(error);
        res.status(401).json({error: "Unauthorized"});
    }
}

module.exports = {
    authenticator,
    authenicateUser,
    generateToken
}
const bcrypt =require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma =require('../config/prisma');

const register =async (req,res) => {
    try{
        const {name,email,password,role}= req.body;
        if(!name || !email || !password || !role){
            return res.status(400).json({message:'name, email and password are required'});
        }
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where : {email}
    })
    if(existingUser){
        return res.status(400).json({message:'User already exists'});
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword =await bcrypt.hash(password,salt);

    // Create user
    const user = await prisma.user.create({
        data :{
            name,
            email,
            password:hashedPassword,
            role:role || 'customer'
        }
    })
    res.status(201).json({
        message:'User registered successfully',
        user:{
            id:user.id,
            name:user.name,
            email:user.email,
            role:user.role
        }
    })

    }catch (error){
        console.error('Login Error:', error);
        res.status(500).json({message:'Internal Server Error'});
    }
}

const login =async (req,res) =>{
    try{
        const {email, password}=req.body;

        if(!email || !password){
            return res.status(400).json({message:'Email and password are required'});
        }

        // Find user
        const user = await prisma.user.findUnique({
            where:{email}
        })
        if(!user){
            return res.status(401).json({message:'Invalid credentials'});
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(401).json({message:'Invalid credentials'});
        }

        const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
        )

        res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.json({
        message: 'Login successful',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
        })
    }catch (error){
        console.error('Login Error:', error);
        return res.status(500).json({message:'Internal Server Error'});
    }
}

const logout = (req,res) =>{
    res.clearCookie('token');
    res.json({message:'Logout successful'});
}

module.exports ={
    register,
    login,
    logout
}
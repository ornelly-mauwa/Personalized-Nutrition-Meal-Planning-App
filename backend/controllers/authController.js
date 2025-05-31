import dotenv from 'dotenv';
dotenv.config();
import User from '../models/userModel.js'; // ✅ Default import
import { userSchema, signinSchema } from "../middleware/validator.js";
import { doHash, doHashValidation } from "../utils/hashing.js"; // if applicable
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const { error, value } = userSchema.validate({
            username,
            email,
            password,
            role
        });


        if (error) {
            return res.status(401).json({ message: error.details[0].message })
        }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(401).json({ success: false, message: 'User already exists' });
        }
        const hashedPassword = await doHash(password, 12);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        });

        const result = await newUser.save();
        result.password = undefined; // Remove password from response for security

        return res.status(201).json({ success: true, message: 'Your account has been created successfully', user: result });

        // return res.status(201).json({ success: true, message: 'User created successfully', result, });
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { error } = signinSchema.validate({ email, password });
        if (error) {
            return res.status(401).json({ success: false, message: error.details[0].message });
        }

        const existingUser = await User.findOne({
            where: { email },
            attributes: ['id', 'email', 'password', 'username', 'role', 'verified'], // initially fetch needed fields
        });

        if (!existingUser) {
            return res.status(401).json({ success: false, message: 'User does not exist!' });
        }

        const isValid = await doHashValidation(password, existingUser.password);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials!' });
        }

        const token = jwt.sign({
            userId: existingUser.id,
            username: existingUser.username,
            email: existingUser.email,
            role: existingUser.role,
            verified: existingUser.verified,
        }, process.env.JWT_SECRET);

        // Re-fetch user without password for response
        const fullUser = await User.findOne({
            where: { email },
            attributes: { exclude: ['password'] },
        });

        res.cookie('Authorization', 'Bearer ' + token, {
            expires: new Date(Date.now() + 24 * 3600000),
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
        }).status(200).json({
            success: true,
            token,
            user: fullUser,
            message: 'Logged in successfully',
        });

    } catch (error) {
        console.error('Error during signin:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // ✅ Add this

        const user = await User.findOne({
            where: { id: decoded.userId },
            attributes: { exclude: ['password'] },
        });

        if (!user) {
            console.log('User not found for ID:', decoded.userId); // ✅ Add this
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ user });
    } catch (err) {
        console.error('Token validation error:', err); // ✅ Add this
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};



export const signout = async (req, res) => {
    res
        .clearCookie('Authorization')
        .status(200)
        .json({ success: true, message: 'Logged out successfully' });
}

export const sendVerificationCode = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (user.verified) {
            return res.status(400).json({ success: false, message: 'User already verified' });
        }

        // Generate a verification code and save it to the user
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code


        // Here you would send the verification code via email (not implemented in this example)
        console.log(`Verification code for ${email}: ${verificationCode}`);

        return res.status(200).json({ success: true, message: 'Verification code sent successfully' });

    } catch (error) {
        console.error('Error sending verification code:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};  

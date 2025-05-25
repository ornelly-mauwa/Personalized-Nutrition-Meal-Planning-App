
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

        res.status(201).json({ success: true, message: 'Your account has been created successfully', user: result });

        return res.status(201).json({ success: true, message: 'User created successfully', result, });
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { error, value } = signinSchema.validate({
            email,
            password
        });

        if (error) {
            return res.status(401).json({ success: false, message: error.details[0].message });
        }

        const existingUser = await User.findOne({
            where: { email },
            attributes: ['password'] // list needed fields explicitly
        });
        if (!existingUser) {
            return res.status(401).json({ success: false, message: 'User does not exists !' });
        }

        const result = await doHashValidation(password, existingUser.password)
        if (!result) {
            return res.status(401).json({ success: false, message: 'Invalid credentials !' });
        }
        const token = jwt.sign({
            userId: existingUser._id,
            username: existingUser.username,
            email: existingUser.email,
            role: existingUser.role,
            verified: existingUser.verified,
        }, process.env.TOKEN_SECRET
        );

        res.cookie('Authorization', 'Bearer' + token, {
            expires: new Date(Date.now() + 24 * 3600000), httpOnly: process.env.NODE_env === 'production',
            secure: process.env.NODE_ENV === 'production',
        })
            .json({
                success: true,
                token,
                message: 'logged in successfuly',

            });

    } catch (error) {
        console.error('Error during signin:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
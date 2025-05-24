
import User from '../models/userModel.js'; // ✅ Default import
import userSchema from "../middleware/validator.js";
import doHash from "../utils/hashing.js"; // if applicable


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
        const existingUser = await User.findOne({ email });
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

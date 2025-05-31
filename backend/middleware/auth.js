import jwt from 'jsonwebtoken';
import models from '../models/index.js';
import dotenv from 'dotenv';
dotenv.config();

const { User } = models;

const authMiddleware = async (req, res, next) => {
    console.log('=== AUTH MIDDLEWARE DEBUG ===');
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('JWT_SECRET value:', process.env.JWT_SECRET ? 'Present' : 'Missing');

    // Debug ALL headers to see what's actually being received
    console.log('All request headers:', JSON.stringify(req.headers, null, 2));
    console.log('Authorization header raw:', req.headers.authorization);
    console.log('Authorization header (case variations):');
    console.log('  - authorization:', req.headers['authorization']);
    console.log('  - Authorization:', req.headers['Authorization']);

    let token = null;

    // Enhanced token extraction logic
    try {
        // Method 1: Check Authorization header (most common for mobile apps)
        const authHeader = req.headers.authorization || req.headers['Authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.replace('Bearer ', '');
            console.log('✅ Token found in Authorization header');
        }

        // Method 2: Check cookies (for web browsers)
        else if (req.headers.cookie) {
            console.log('🍪 Checking cookies for token...');
            console.log('Raw cookie:', req.headers.cookie);

            // Parse cookies manually
            const cookies = req.headers.cookie.split(';').reduce((acc, cookie) => {
                const [key, value] = cookie.trim().split('=');
                if (key && value) {
                    acc[key] = decodeURIComponent(value);
                }
                return acc;
            }, {});

            console.log('Parsed cookies:', cookies);

            if (cookies.Authorization) {
                // Handle both 'Bearer token' and just 'token' formats in cookies
                token = cookies.Authorization.startsWith('Bearer ')
                    ? cookies.Authorization.replace('Bearer ', '')
                    : cookies.Authorization;
                console.log('✅ Token found in cookie');
            }
        }

        // Method 3: Check if using cookie-parser middleware (if available)
        else if (req.cookies && req.cookies.Authorization) {
            console.log('🍪 Checking parsed cookies...');
            token = req.cookies.Authorization.startsWith('Bearer ')
                ? req.cookies.Authorization.replace('Bearer ', '')
                : req.cookies.Authorization;
            console.log('✅ Token found in parsed cookies');
        }

        // Method 4: Check for token in request body (fallback, not recommended for production)
        else if (req.body && req.body.token) {
            console.log('📝 Checking request body for token...');
            token = req.body.token;
            console.log('⚠️ Token found in request body (not recommended)');
        }

        // Method 5: Check query parameters (fallback, not recommended for production)
        else if (req.query && req.query.token) {
            console.log('🔗 Checking query parameters for token...');
            token = req.query.token;
            console.log('⚠️ Token found in query parameters (not recommended)');
        }

    } catch (parseError) {
        console.log('⚠️ Error parsing token from request:', parseError.message);
    }

    // Validate token existence and format
    if (!token) {
        console.log('❌ No token found in any location (header, cookies, body, query)');
        return res.status(401).json({
            error: 'Authentication required',
            details: 'No token provided in Authorization header or cookies'
        });
    }

    // Clean and validate token
    token = token.trim();
    console.log('Token extracted:', token ? token.substring(0, 20) + '...' : 'null');
    console.log('Token length:', token ? token.length : 0);

    if (!token || token === 'undefined' || token === 'null' || token === '') {
        console.log('❌ Token is empty or invalid');
        return res.status(401).json({
            error: 'Authentication required',
            details: 'Invalid or empty token'
        });
    }

    try {
        console.log('🔍 Attempting to verify token...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token decoded successfully:', {
            userId: decoded.userId || decoded.id,
            username: decoded.username,
            email: decoded.email,
            exp: decoded.exp ? new Date(decoded.exp * 1000) : 'No expiration'
        });

        // Handle both 'id' and 'userId' in token payload for compatibility
        const userId = decoded.userId || decoded.id;

        if (!userId) {
            console.log('❌ No user ID found in token payload');
            return res.status(401).json({
                error: 'Authentication required',
                details: 'User ID not found in token'
            });
        }

        console.log('🔍 Looking up user with ID:', userId);
        const user = await User.findByPk(userId);
        console.log('User found:', !!user);

        if (user) {
            console.log('User details:', {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                verified: user.verified
            });
        }

        if (!user) {
            console.log('❌ User not found in database');
            return res.status(401).json({
                error: 'Authentication required',
                details: 'User not found in database'
            });
        }

        // Attach user to request object
        req.user = user;
        req.token = token; // Also attach the token for potential use in responses
        req.decoded = decoded; // Attach decoded token data

        console.log('✅ Authentication successful, proceeding to next middleware');
        next();

    } catch (err) {
        console.log('❌ JWT verification error:', err.message);
        console.log('Error details:', {
            name: err.name,
            message: err.message,
            stack: err.stack
        });

        // Handle different JWT errors with appropriate responses
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Authentication required',
                details: 'Token has expired. Please log in again.'
            });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Authentication required',
                details: 'Invalid token format or signature.'
            });
        } else if (err.name === 'NotBeforeError') {
            return res.status(401).json({
                error: 'Authentication required',
                details: 'Token not active yet.'
            });
        } else {
            return res.status(401).json({
                error: 'Authentication required',
                details: 'Token verification failed.'
            });
        }
    }
};

export default authMiddleware;
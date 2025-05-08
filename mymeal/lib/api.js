// Replace with your dev machine's IP or use localhost if you're using a simulator
const API_BASE = 'http://192.168.10.160:8000/api';

// Function to make authenticated requests
const authFetch = async (endpoint, options = {}) => {
    // Get token from global context
    const token = global.authToken;

    if (token) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };
    }

    return fetch(`${API_BASE}${endpoint}`, options);
};

// Auth functions
export async function SignIn(email, password) {
    try {
        console.log(`Attempting login to ${API_BASE}/users/login with email: ${email}`);

        const response = await fetch(`${API_BASE}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Login failed with status:', response.status);
            console.error('Response data:', data);
            throw new Error(data.message || data.errors?.join(', ') || 'Login failed');
        }

        console.log('Login successful:', data.user);
        return data;
    } catch (error) {
        console.error('Login error:', error.message);
        throw error;
    }
}

export async function SignUp(username, email, password, role = 'user') {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // Extended to 15 seconds

    try {
        console.log(`Sending registration to ${API_BASE}/users/register:`, {
            username,
            email,
            role
        });

        const response = await fetch(`${API_BASE}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, role }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Try to parse JSON response
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            console.error('Non-JSON response:', text);
            throw new Error('Server returned non-JSON response');
        }

        if (!response.ok) {
            console.error('Registration failed with status:', response.status);
            console.error('Response data:', data);
            throw new Error(data.message || data.errors?.join(', ') || 'Registration failed');
        }

        console.log('Registration successful:', data.user);
        return data;
    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            console.error('Registration request timed out');
            throw new Error('Request timed out - server may be unreachable');
        }

        console.error('Registration error:', error);
        throw error;
    }
}

// Add a connection test function that you can call when debugging
export async function testConnection() {
    try {
        console.log(`Testing connection to: ${API_BASE}`);
        const start = Date.now();

        // Try a simple GET request to your server
        const response = await fetch(`${API_BASE}/users/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Include token if available
                ...(global.authToken ? { 'Authorization': `Bearer ${global.authToken}` } : {})
            }
        });

        const time = Date.now() - start;
        console.log(`Connection response: ${response.status} in ${time}ms`);

        return {
            success: response.status !== 500,
            status: response.status,
            time
        };
    } catch (error) {
        console.error('Connection test failed:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

export async function getCurrentUser() {
    try {
        const response = await authFetch('/users/me');

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch user data');
        }

        return response.json();
    } catch (error) {
        console.error('Get current user error:', error);
        throw error;
    }
}

export async function getUserRoles() {
    try {
        const response = await authFetch('/users/roles');

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch user roles');
        }

        const data = await response.json();
        return data.role;
    } catch (error) {
        console.error('Get user roles error:', error);
        throw error;
    }
}

export async function logout() {
    try {
        const response = await authFetch('/users/logout', {
            method: 'POST'
        });

        return response.json();
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
}


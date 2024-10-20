const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register new user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    console.log('Received registration request', { name, email }); // Log incoming request data

    try {
        // Check if user exists
        const userExists = await User.findOne({ email });
        console.log('User exists', userExists); // Log if user already exists

        if (userExists) {
            return res.status(400).json({ message: 'Este email já está sendo utilizado. Insira outro email ou Redefina sua Senha.' });
        }

        // Create a new user
        const user = await User.create({
            name,
            email,
            password
        });
        console.log('User created:', user); // Log the created user object

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Dados do usuário inválidos' });
        }
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.email) {
            // Handle duplicate email error gracefully
            return res.status(400).json({ message: 'Este email já está sendo utilizado. Insira outro email ou Redefina sua Senha.' });
        }

        console.error('Error during registration:', error); // Log the error with more detail
        return res.status(500).json({ message: 'Erro no servidor' });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            // Log to verify if the user is being found
            console.log('User not found for email:', email);
            return res.status(401).json({ message: 'E-mail ou senha incorretos' });
        }

        // Check if the password matches
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'E-mail ou senha incorretos' });
        }
        
        // If everything is correct, send the response with user data and token
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });

    } catch (error) {
        console.error('Error during login', error);
        return res.status(500).json({ message: 'Erro no servidor' });
    }
};

// Get user profile (protected route)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email
            });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Erro no servidor' });
    }
};

// Update user profile (protected route)
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar perfil' });
    }
}

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
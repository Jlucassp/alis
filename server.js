const express = require('express');
const crypto = require('crypto'); // For generating unique tokens
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const userRoutes = require('./routes/userRoutes');
const fetch = require('node-fetch');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Middleware to parse JSON
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log('Error connecting to MongoDB:', err);
});

const getUserByEmail = async (email) => {
    return await User.findOne({ email });
};

// Utility function to verify the reset token
const verifyResetToken = async (token) => {
    return await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });
};

// Password recovery route
app.post('/api/users/recover-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Check if user exists in your database
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'E-mail não encontrado. Por favor, insira um e-mail válido.'});
        }

        // Generate a token for password reset
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetLink = `http://localhost:5000/reset-password/${token}`;

        // Send email with Mailgun
        const response = await fetch(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                from: process.env.FROM_EMAIL,
                to: email,
                subject: 'Recuperação de Senha',
                text: `Você está recebendo este e-mail porque recebeu uma solicitação para redefinir a senha.\n\nClique no seguinte link para redefinir sua senha:\n\n${resetLink}`
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        res.status(200).json({ message: 'E-mail de recuperação enviado.' });
    } catch (error) {
        console.error('Error during password recovery:', error);
        res.status(500).json({ message: 'Erro ao enviar o e-mail de recuperação, tente novamente mais tarde.' });
    }
});

// Password reset route to serve the reset form
app.get('/reset-password/:token', async (req, res) => {
    const { token } = req.params;

    try {
        // Verify the reset token
        const user = await verifyResetToken(token);

        if (!user) {
            return res.status(400).json({ message: 'O token de recuperação de senha é inválido ou expirou.' });
        }

        // Redirect to the main page with a token in session storage
        res.send(`
            <script>
                sessionStorage.setItem('resetPasswordToken', '${token}');
                window.location.href = '/';
            </script>
        `);
    } catch (error) {
        console.error('Error finding user with reset token:', error);
        res.status(500).json({ message: 'Erro no servidor. Tente novamente mais tarde.' });
    }
});

// Password reset route to handle the reset form submission
app.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // Reuse utility function to verify the token
        const user = await verifyResetToken(token);

        if (!user) {
            return res.status(400).json({ message: 'O token de recuperação de senha é inválido ou expirou.' });
        }

        // Update the user's password and clear the reset token fields
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        // Respond with JSON success message
        res.status(200).json({ message: 'Sua senha foi atualizada com sucesso. Você será redirecionado para realizar o login.' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Erro no servidor. Tente novamente mais tarde.' });
    }
});

// Routes
app.use('/api/users', userRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: [true, 'Por favor, insira seu nome']
    },
    email: { 
        type: String,
        required: [true, 'Por favor, insira seu e-mail'],
        unique: true 
    },
    password: { 
        type: String,
        required: [true, 'Por favor, insira sua senha']
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
}, { timestamps: true });

// Hash password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', userSchema);
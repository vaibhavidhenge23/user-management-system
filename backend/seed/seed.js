const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: require('path').join(__dirname, '../.env') });

const users = [
    {
        name: 'Super Admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        status: 'active',
    },
    {
        name: 'Manager User',
        email: 'manager@example.com',
        password: 'manager123',
        role: 'manager',
        status: 'active',
    },
    {
        name: 'Regular User',
        email: 'user@example.com',
        password: 'user123',
        role: 'user',
        status: 'active',
    },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');

        await User.deleteMany({});
        console.log('Cleared existing users');

        await User.create(users);
        console.log('Seeded users:');
        console.log('  admin@example.com / admin123');
        console.log('  manager@example.com / manager123');
        console.log('  user@example.com / user123');

        process.exit(0);
    } catch (err) {
        console.error('Seed failed:', err.message);
        process.exit(1);
    }
};

seed();
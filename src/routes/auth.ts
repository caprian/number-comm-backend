import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import crypto from 'crypto';

const authRouter = express.Router();
//const JWT_SECRET = crypto.randomBytes(32).toString('hex'); 
const JWT_SECRET = 'jwt'

authRouter.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '5m' });

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering user');
  }
});

authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).send('Invalid username or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).send('Invalid username or password');
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '5m' });
  res.status(200).json({ token });
});

export { authRouter, JWT_SECRET };

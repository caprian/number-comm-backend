import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { authRouter } from './routes/auth';
import { calcRouter } from './routes/calculation';

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

app.use('/auth', authRouter);
app.use('/calc', calcRouter);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ellty')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }).catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

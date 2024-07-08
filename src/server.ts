import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors'; // Import CORS package
import { authRouter } from './routes/auth';
import { calcRouter } from './routes/calculation';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(bodyParser.json());

// Use CORS middleware
app.use(cors());

app.use('/auth', authRouter);
app.use('/calc', calcRouter);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/numtree', {
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

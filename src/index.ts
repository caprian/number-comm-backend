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

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://shashankag20:Mymail%4020@shashank.riw6cr8.mongodb.net/Shashank?retryWrites=true&w=majority&appName=Shashank')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }).catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { DATABASE } from './config';
import authRoutes from './routes/auth';
import adsRoutes from './routes/ads';
import bodyParser from 'body-parser';
import messageRoute from './routes/message';
import categorieRoute from './routes/caregory';
import locationRoute from './routes/locationRoutes';
require('dotenv').config();


const morgan = require('morgan');

const app = express();

// db connection
mongoose.set('strictQuery', false); // required for version 6
mongoose
  .connect(DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('DB connected'))
  .catch((err) => console.log('DB CONNECTION ERROR: ', err));

// middlewares
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

// route middlewares
app.use('/api', authRoutes);
app.use('/api', adsRoutes);
app.use('/api', messageRoute);
app.use('/api', categorieRoute);
 app.use('/api', locationRoute);

 const port = process.env.PORT || 8000; 
const ipAddress = ['192.168.1.73' , '192.168.35.206'];

app.listen(port, ipAddress, () => console.log(`Server running on port ${port}`));

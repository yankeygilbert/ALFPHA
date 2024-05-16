import express from 'express';
import upload from 'express-fileupload';
import constants from './src/constants';
import cookieParser from 'cookie-parser'
import passport from 'passport';
import cors from 'cors';


let clientPort: number | string;
constants.NODE_ENV === "production" ? (clientPort = "") : (clientPort = `:${constants.CLIENT_PORT}`!);

const app = express();
//Passport middleware
require('./src/middlewares/passport')

//Innitialize middleware
app.use(express.json());
app.use(upload());
app.use(cookieParser())
app.use(cors({ origin: `${constants.CLIENT_HOST}${clientPort}`, credentials: true }))
app.use(passport.initialize());

//Import routes from routes folder
import authRoutes from './src/routes/authentication';
import docRoutes from './src/routes/documents';

//Initialize routes
app.use('/api', authRoutes)
app.use('/api', docRoutes);

// Start server


const startServer = () => {
  try {
    app.listen(constants.SERVER_PORT, () => {
      console.log("listening on port " + constants.SERVER_PORT);
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
};

startServer();
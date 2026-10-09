import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authrouter from './routes/auth.route.js';
import userrouter from './routes/user.route.js';
import cookieParser from 'cookie-parser';
import geminiResponse from './gemini.js'
import cors from 'cors'

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://virtual-assistant-frontend-081z.onrender.com",
  credentials: true,
}))
const port = Number(process.env.PORT) || 5050;

app.use(express.json());
app.use(cookieParser());

app.use('/api', authrouter);
app.use('/api',userrouter)



app.listen(port, async () => {
  try {
    await connectDB();
    console.log('Server started on port ' + port);
  } catch (err) {
    console.error('Server failed to start:', err.message);
  }
});

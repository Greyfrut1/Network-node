import express from 'express';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middlewares/errorMiddleware';
import cors from 'cors';

const app = express();

app.use(cors({ origin: process.env.FRONT_URL || 'http://localhost:3000' }));


app.use(express.json()); // Парсинг JSON

app.use('/api', userRoutes); // Маршрути

app.use(errorHandler); // Обробка помилок

export default app;

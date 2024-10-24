import express from 'express';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middlewares/errorMiddleware';

const app = express();

app.use(express.json()); // Парсинг JSON

app.use('/api', userRoutes); // Маршрути

app.use(errorHandler); // Обробка помилок

export default app;

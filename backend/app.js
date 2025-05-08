import express from 'express';
import cors from 'cors';
import router from './routes/routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/links', router);

export default app;

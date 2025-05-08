import express from 'express';
import cors from 'cors';
import router from './routes/routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/links', router);

app.use('/api/links', linkRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Shorter API is runnin!'});
});

app.listen(PORT, () => {
    console.log(`App is on port ${PORT}`)
});

export default app;

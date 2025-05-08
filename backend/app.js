import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import linkRoutes from './routes/routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use('/api/links', linkRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Shorter API is runnin!'});
});

app.listen(PORT, () => {
    console.log(`App is on port ${PORT}`)
});

export default app;
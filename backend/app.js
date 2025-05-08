import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import linkRoutes from './routes/routes.js';
import router from './routes/routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cors());
app.use(express.json());
app.use('/api/links', linkRoutes);
app.use('/api', router);

router.stack.forEach(r => {
    if (r.route) console.log('🛣️ Registered:', r.route.path);
  });

// app.get('/', (req, res) => {
//     res.status(200).json({ message: 'Shorter API is runnin!'});
// });

app.listen(PORT, () => {
    console.log(`App is on port ${PORT}`)
});

export default app;

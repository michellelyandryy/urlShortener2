import app from './app.js';
import './config/db.js';

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is on port ${PORT}`)
});
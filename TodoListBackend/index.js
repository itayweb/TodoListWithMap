import express from 'express';
import cors from 'cors';
import router from './routes/index.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Basic Route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/v1', router);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
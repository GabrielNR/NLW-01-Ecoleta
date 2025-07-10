import express from 'express'
import routes from './routes'
import path from 'path'
import cors from 'cors'

const app = express();

app.use(cors())
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes)

const PORT = 3333;

app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}!`);
});
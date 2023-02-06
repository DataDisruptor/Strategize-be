import express from 'express';
import UserRouter from './routes/userRoute.js';
import ProjectRouter from './routes/projectsRoute.js';
import LTGRouter from './routes/LTGsRoute.js';
import objectiveRouter from './routes/objectivesRoute.js';
import taskRouter from './routes/tasksRoute.js';
import { errorHandler } from './middleware/errorHandler.js';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cors from 'cors';
import mongodb from 'mongodb';
//setup
dotenv.config();
connectDB();
const PORT = process.env.PORT || 4000;
const app = express();
//routing
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/user", UserRouter);
app.use("/api/projects", ProjectRouter);
app.use("/api/project/ltg", LTGRouter);
app.use("/api/project/ltg/objective", objectiveRouter);
app.use("/api/project/ltg/objective/task", taskRouter);
app.use(errorHandler);
//validation made simple
app.get('/', (req, res) => {
    res.send('BE is Connected!');
});
//headers setup
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    if (req.method === 'OPTIONS')
        res.sendStatus(200);
    else
        next();
});
//connection to server and db
const client = new mongodb.MongoClient(process.env.MONGO_URI);
const dbName = 'strategizedb';
client.connect().then(() => {
    global.db = client.db(dbName);
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
});

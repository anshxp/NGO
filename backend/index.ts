import express, { Express } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './dist/connection/db';
import { graphqlHTTP } from "express-graphql";


dotenv.config();

const app: Express = express();

app.use(express.json());

async function start() {
    try {
        await connectDB();
        const PORT = process.env.PORT;

        app.listen(PORT, () => {
            console.log(`App is listening on http://localhost:${PORT}/graphql`);
        });
    } catch (err) {
        console.error('Error Starting the Project: ', err);
        process.exit(1);
    }
}

start();
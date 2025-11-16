"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./connection/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
async function start() {
    try {
        await (0, db_1.connectDB)();
        const PORT = process.env.PORT;
        app.listen(PORT, () => {
            console.log(`App is listening on http://localhost:${PORT}/graphql`);
        });
    }
    catch (err) {
        console.error('Error Starting the Project: ', err);
        process.exit(1);
    }
}
start();

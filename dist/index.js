"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_1 = require("./routes/auth");
const calculation_1 = require("./routes/calculation");
const app = (0, express_1.default)();
const PORT = 8080;
app.use(body_parser_1.default.json());
app.use('/auth', auth_1.authRouter);
app.use('/calc', calculation_1.calcRouter);
mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb+srv://shashankag20:Mymail%4020@shashank.riw6cr8.mongodb.net/Shashank?retryWrites=true&w=majority&appName=Shashank')
    .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

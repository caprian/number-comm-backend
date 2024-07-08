"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const authRouter = express_1.default.Router();
exports.authRouter = authRouter;
//const JWT_SECRET = crypto.randomBytes(32).toString('hex'); 
const JWT_SECRET = 'jwt';
exports.JWT_SECRET = JWT_SECRET;
authRouter.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const existingUser = yield User_1.default.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already exists');
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new User_1.default({ username, password: hashedPassword });
        yield newUser.save();
        const token = jsonwebtoken_1.default.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '5m' });
        res.status(201).json({ token });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error registering user');
    }
}));
authRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield User_1.default.findOne({ username });
    if (!user) {
        return res.status(400).send('Invalid username or password');
    }
    const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).send('Invalid username or password');
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: '5m' });
    res.status(200).json({ token });
}));

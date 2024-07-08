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
exports.calcRouter = void 0;
const express_1 = __importDefault(require("express"));
const Calculation_1 = __importDefault(require("../models/Calculation"));
const authMiddleware_1 = require("../utils/authMiddleware");
const calcRouter = express_1.default.Router();
exports.calcRouter = calcRouter;
const operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
};
// GET /calc - Fetch all calculations
calcRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const calculations = yield Calculation_1.default.find().populate('userId', 'username');
        res.status(200).json(calculations);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error fetching calculations');
    }
}));
// POST /calc/start - Start a new calculation
calcRouter.post('/start', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startingNumber } = req.body;
    const userId = req.user.id;
    const calculation = new Calculation_1.default({
        parent: null,
        left: startingNumber,
        operator: '+',
        right: 0,
        result: startingNumber,
        initialResult: startingNumber,
        userId: userId,
    });
    try {
        yield calculation.save();
        const populatedCalculation = yield calculation.populate('userId', 'username');
        res.status(201).json(populatedCalculation);
    }
    catch (err) {
        console.error(err);
        res.status(400).send('Error starting calculation');
    }
}));
// POST /calc/comment - Add a comment (operation) to an existing calculation
calcRouter.post('/comment', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { parentId, operator, right } = req.body;
    try {
        const parentCalculation = yield Calculation_1.default.findById(parentId);
        if (!parentCalculation) {
            return res.status(404).send('Parent calculation not found');
        }
        const newResult = operations[operator](parentCalculation.result, right);
        const userId = req.user.id;
        const comment = new Calculation_1.default({
            parent: parentId,
            left: parentCalculation.result,
            operator,
            right,
            result: newResult,
            initialResult: newResult,
            userId: userId,
        });
        parentCalculation.result = newResult;
        yield parentCalculation.save();
        yield comment.save();
        const populatedComment = yield comment.populate('userId', 'username');
        res.status(201).json(populatedComment);
    }
    catch (err) {
        console.error(err);
        res.status(400).send('Error adding comment');
    }
}));

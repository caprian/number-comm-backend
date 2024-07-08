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
exports.addOperation = exports.createPost = exports.getPosts = void 0;
const Post_1 = __importDefault(require("../models/Post"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getUserIdFromToken = (token) => {
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    return decoded.id;
};
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post_1.default.find().populate('user', 'username');
        res.status(200).json(posts);
    }
    catch (err) {
        res.status(400).json({ message: 'Error fetching posts' });
    }
});
exports.getPosts = getPosts;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { startNumber } = req.body;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const userId = getUserIdFromToken(token);
        const post = new Post_1.default({ startNumber, operations: [], user: userId });
        yield post.save();
        res.status(201).json(post);
    }
    catch (err) {
        res.status(400).json({ message: 'Error creating post' });
    }
});
exports.createPost = createPost;
const addOperation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { postId, type, number } = req.body;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const post = yield Post_1.default.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const userId = getUserIdFromToken(token);
        if (post.user.toString() !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const lastResult = post.operations.length
            ? post.operations[post.operations.length - 1].result
            : post.startNumber;
        let result;
        switch (type) {
            case 'add':
                result = lastResult + number;
                break;
            case 'subtract':
                result = lastResult - number;
                break;
            case 'multiply':
                result = lastResult * number;
                break;
            case 'divide':
                result = lastResult / number;
                break;
            default:
                return res.status(400).json({ message: 'Invalid operation type' });
        }
        post.operations.push({ type, number, result });
        yield post.save();
        res.status(200).json(post);
    }
    catch (err) {
        res.status(400).json({ message: 'Error adding operation' });
    }
});
exports.addOperation = addOperation;

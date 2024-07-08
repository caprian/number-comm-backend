"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    startNumber: { type: Number, required: true },
    operations: [
        {
            type: {
                type: String,
                enum: ['add', 'subtract', 'multiply', 'divide'],
                required: true
            },
            number: { type: Number, required: true },
            result: { type: Number, required: true }
        }
    ],
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }
});
exports.default = (0, mongoose_1.model)('Post', postSchema);

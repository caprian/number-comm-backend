import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  username: string;
  password: string;
}

const UserSchema: Schema<UserDocument> = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model<UserDocument>('User', UserSchema);

export default User;

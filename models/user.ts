import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  students: { type: [String] },
  otp: { type: String },
  isActive: { type: Boolean, default: true },
});

userSchema.methods.toJSON = function () {
  const { __v, password, students, _id, otp, ...user } = this.toObject();
  return { id: _id, ...user };
};

export default model("User", userSchema);

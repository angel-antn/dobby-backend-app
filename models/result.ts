import { Schema, model } from "mongoose";

const resultSchema = new Schema({
  userId: { type: String, required: true },
  details: { type: String, required: true },
  createdAt: { type: String, required: true },
  questionsCount: { type: Number, required: true },
  questionsQty: { type: Number, required: true },
});

resultSchema.methods.toJSON = function () {
  const { __v, _id, ...result } = this.toObject();
  return { id: _id, ...result };
};

export default model("Result", resultSchema);

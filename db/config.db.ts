import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    mongoose.connect(process.env.MONGO_DB_URL ?? "");
  } catch (err) {
    throw new Error(`error al inicializar la bd: ${err}`);
  }
};

export { dbConnection };

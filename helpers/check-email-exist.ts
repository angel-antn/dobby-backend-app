import User from "../models/user";

export const checkEmailExist = async (email: string) => {
  if (await User.findOne({ email })) {
    throw new Error("email already exist!");
  }
};

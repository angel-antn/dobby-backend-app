import User from "../models/user";

export const checkUserIdExist = async (id: string) => {
  if (!(await User.findById(id))) {
    throw new Error("user not exist!");
  }
};

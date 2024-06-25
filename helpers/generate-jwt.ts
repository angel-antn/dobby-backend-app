import jwt from "jsonwebtoken";

export const generateJwt = (id: string) => {
  try {
    const payload = { id };
    const jwtSign = jwt.sign(payload, process.env.JWT_PASSWORD!, {
      expiresIn: "7d",
    });
    return jwtSign;
  } catch {
    return undefined;
  }
};

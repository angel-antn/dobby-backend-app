import express from "express";
import cors from "cors";

import { userRouter } from "./router/user.route";
import { dbConnection } from "./db/config.db";

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

app.use("/api/users", userRouter);

dbConnection();

app.listen(process.env.PORT, () => {
  console.log("Server at port:", process.env.PORT);
});

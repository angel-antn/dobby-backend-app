import { Router } from "express";
import {
  register,
  login,
  me,
  update,
  getStudents,
  addStudent,
  deleteStudent,
} from "../controllers/user.controller";
import { check } from "express-validator";
import { validateFieldsMiddleware } from "../middlewares/validate-fields.middleware";
import { checkEmailExist } from "../helpers/check-email-exist";
import { checkUserIdExist } from "../helpers/check-user-id-exist";
import { checkPage } from "../helpers/check-page";
import { checkPageSize } from "../helpers/check-page-size";
import { validateJwtMiddleware } from "../middlewares/validate-jwt.middleware";

const userRouter = Router();

userRouter.post(
  "/register",
  [
    check("name", "name is required").not().isEmpty(),
    check("lastname", "lastname is required").not().isEmpty(),
    check("password", "password is required").not().isEmpty(),
    check("password", "password length min is 6").isLength({ min: 6 }),
    check("email", "email is required").not().isEmpty(),
    check("email", "not valid email").isEmail(),
    check("email").custom(checkEmailExist),
    validateFieldsMiddleware,
  ],
  register
);

userRouter.post(
  "/login",
  [
    check("password", "password is required").not().isEmpty(),
    check("password", "password length min is 6").isLength({ min: 6 }),
    check("email", "email is required").not().isEmpty(),
    check("email", "not valid email").isEmail(),
    check("email").custom(checkEmailExist),
  ],
  login
);

userRouter.get("/me", [validateJwtMiddleware], me);

userRouter.patch(
  "/:id",
  [
    check("id", "id is required").not().isEmpty(),
    check("id", "not valid id").isMongoId(),
    check("id").custom(checkUserIdExist),
    validateFieldsMiddleware,
  ],
  update
);

userRouter.get(
  "/:id/students",
  [
    check("id", "id is required").not().isEmpty(),
    check("id", "not valid id").isMongoId(),
    check("id").custom(checkUserIdExist),
    check("page").custom(checkPage),
    check("pageSize").custom(checkPageSize),
    validateFieldsMiddleware,
  ],
  getStudents
);

userRouter.post(
  "/:id/students",
  [
    check("id", "id is required").not().isEmpty(),
    check("id", "not valid id").isMongoId(),
    check("id").custom(checkUserIdExist),
  ],
  addStudent
);

userRouter.delete(
  "/:id/students/:studentId",
  [
    check("id", "id is required").not().isEmpty(),
    check("id", "not valid id").isMongoId(),
    check("id").custom(checkUserIdExist),
    check("studentId", "studentId is required").not().isEmpty(),
    check("studentId", "not valid studentId").isMongoId(),
    check("studentId").custom(checkUserIdExist),
  ],
  deleteStudent
);

export { userRouter };

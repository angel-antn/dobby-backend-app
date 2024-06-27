import { Router } from "express";
import { create, getResults, getStats } from "../controllers/result.controller";
import { check } from "express-validator";
import { validateFieldsMiddleware } from "../middlewares/validate-fields.middleware";
import { checkUserIdExist } from "../helpers/check-user-id-exist";
import { checkPage } from "../helpers/check-page";
import { checkPageSize } from "../helpers/check-page-size";

const resultRouter = Router();

resultRouter.post(
  "/",
  [
    check("userId", "userID is required").not().isEmpty(),
    check("details", "details is required").not().isEmpty(),
    check("questionsQty", "questions qty is required").not().isEmpty(),
    check("level", "level is required").not().isEmpty(),
    check("questionsCount", "questions count is required").not().isEmpty(),
    validateFieldsMiddleware,
  ],
  create
);

resultRouter.get(
  "/:userId",
  [
    check("userId", "userId is required").not().isEmpty(),
    check("userId", "not valid userId").isMongoId(),
    check("userId").custom(checkUserIdExist),
    check("page").custom(checkPage),
    check("pageSize").custom(checkPageSize),
    validateFieldsMiddleware,
  ],
  getResults
);

resultRouter.get(
  "/:userId/stats",
  [
    check("userId", "userId is required").not().isEmpty(),
    check("userId", "not valid userId").isMongoId(),
    check("userId").custom(checkUserIdExist),
    validateFieldsMiddleware,
  ],
  getStats
);

export { resultRouter };

import { Request, Response } from "express";
import { CreateResultDto } from "../dtos/result/create-result.dto";
import { paginationDto } from "../dtos/pagination/pagination.dto";
import Result from "../models/result";

const create = async (req: Request<{}, {}, CreateResultDto>, res: Response) => {
  const { details, questionsCount, questionsQty, userId } = req.body;

  const createdAt = new Date();

  const result = new Result({
    userId,
    createdAt: createdAt.toISOString().split("T")[0],
    details,
    questionsCount,
    questionsQty,
  });

  await result.save();

  res.status(200).json({
    result,
  });
};

const getResults = async (
  req: Request<{ userId: string }, {}, {}, paginationDto>,
  res: Response
) => {
  try {
    const { page = "1", pageSize = "5" } = req.query;
    const userId = req.params.userId;

    const results = await Result.find({ userId })
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(pageSize))
      .limit(Number(pageSize));

    res.json(results);
  } catch (err) {
    res.status(500).json({ err });
  }
};

const getStats = async (
  req: Request<{ userId: string }, {}, {}, {}>,
  res: Response
) => {
  const firstDate = new Date();
  const secondDate = new Date();
  const thirdDate = new Date();
  const fourthDate = new Date();
  const fifthDate = new Date();
  const sixthDate = new Date();
  const seventhDate = new Date();

  secondDate.setDate(firstDate.getDate() - 1);
  thirdDate.setDate(firstDate.getDate() - 2);
  fourthDate.setDate(firstDate.getDate() - 3);
  fifthDate.setDate(firstDate.getDate() - 4);
  sixthDate.setDate(firstDate.getDate() - 5);
  seventhDate.setDate(firstDate.getDate() - 6);

  const userId = req.params.userId;

  try {
    const [day_1, day_2, day_3, day_4, day_5, day_6, day_7] = await Promise.all(
      [
        Result.find({
          userId,
          createdAt: firstDate.toISOString().split("T")[0],
        }),
        Result.find({
          userId,
          createdAt: secondDate.toISOString().split("T")[0],
        }),
        Result.find({
          userId,
          createdAt: thirdDate.toISOString().split("T")[0],
        }),
        Result.find({
          userId,
          createdAt: fourthDate.toISOString().split("T")[0],
        }),
        Result.find({
          userId,
          createdAt: fifthDate.toISOString().split("T")[0],
        }),
        Result.find({
          userId,
          createdAt: sixthDate.toISOString().split("T")[0],
        }),
        Result.find({
          userId,
          createdAt: seventhDate.toISOString().split("T")[0],
        }),
      ]
    );

    return res.json({
      day_1: {
        day: firstDate.toISOString(),
        count: day_1.length,
      },
      day_2: {
        day: secondDate.toISOString(),
        count: day_2.length,
      },
      day_3: {
        day: thirdDate.toISOString(),
        count: day_3.length,
      },
      day_4: {
        day: fourthDate.toISOString(),
        count: day_4.length,
      },
      day_5: {
        day: fifthDate.toISOString(),
        count: day_5.length,
      },
      day_6: {
        day: sixthDate.toISOString(),
        count: day_6.length,
      },
      day_7: {
        day: seventhDate.toISOString(),
        count: day_7.length,
      },
    });
  } catch (err) {
    res.status(500).json({ err });
  }
};

export { create, getResults, getStats };

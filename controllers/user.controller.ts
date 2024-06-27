import { Request, Response } from "express";
import User from "../models/user";
import bcryptjs from "bcrypt";
import { UserRegisterDto } from "../dtos/user/user-register.dto";
import { UserLoginDto } from "../dtos/user/user-login.dto";
import { UpdateUserDto } from "../dtos/user/update-user.dto";
import { paginationDto } from "../dtos/pagination/pagination.dto";
import { generateJwt } from "../helpers/generate-jwt";
import jwt from "jsonwebtoken";

const register = async (
  req: Request<{}, {}, UserRegisterDto>,
  res: Response
) => {
  const { email, password, name, lastname } = req.body;

  const user = new User({ email, password, name, lastname });

  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(user.password, salt);

  await user.save();

  res.status(200).json({
    user,
    token: generateJwt(user._id.toString()),
  });
};

const login = async (req: Request<{}, {}, UserLoginDto>, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (
    !user ||
    !user.isActive ||
    !bcryptjs.compareSync(password, user.password)
  ) {
    return res.status(400).json({ msg: "not valid user or password" });
  }

  res.status(200).json({
    user,
    token: generateJwt(user._id.toString()),
  });
};

const me = async (req: Request, res: Response) => {
  const token = req.header("Authorization");
  const payload = jwt.verify(token!, process.env.JWT_PASSWORD!);

  const user = await User.findById((payload as jwt.JwtPayload).id);

  return res
    .status(200)
    .json({ user, token: generateJwt(user!._id.toString()) });
};

const update = async (
  req: Request<{ id: string }, {}, UpdateUserDto>,
  res: Response
) => {
  const { name, lastname } = req.body;

  const user = await User.findByIdAndUpdate(req.params.id, { name, lastname });

  const newUser = await User.findById(user?.id);

  res.status(201).json({ ...newUser?.toJSON() });
};

const getStudents = async (
  req: Request<{ id: string }, {}, {}, paginationDto>,
  res: Response
) => {
  try {
    const { page = "1", pageSize = "5" } = req.query;

    const user = await User.findById(req.params.id);

    if (user && user.students) {
      let listOfStudents = await Promise.all(
        user.students.map(async (studentId) => {
          const student = await User.findById(studentId);
          return student ? student.toJSON() : null;
        })
      );

      listOfStudents = listOfStudents.filter((student) => student !== null);

      const start = (Number(page) - 1) * Number(pageSize);
      const end = Number(start) + Number(pageSize);

      res.json({
        data: listOfStudents.slice(start, end),
        maxPage: Math.ceil(user.students.length / Number(pageSize)),
      });
    }
  } catch (err) {
    res.status(500).json({ err });
  }
};

const addStudent = async (
  req: Request<{ id: string; studentId: string }>,
  res: Response
) => {
  try {
    const user = await User.findById(req.params.id);
    const userStudent = await User.findById(req.body.studentId);

    if (!user || !userStudent)
      return res.status(400).json({ msg: "userId doesn't exist" });

    if (!user.students.includes(userStudent._id.toString())) {
      user.students.push(userStudent._id.toString());
      user.save();
    }

    return res.status(201).json(userStudent);
  } catch (err) {
    res.status(500).json({ err });
  }
};

const deleteStudent = async (
  req: Request<{ id: string; studentId: string }>,
  res: Response
) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(400).json({ msg: "userId doesn't exist" });

    user.students = user.students.filter((student) => {
      return student !== req.params.studentId;
    });
    user.save();

    return res.status(200).json();
  } catch (err) {
    res.status(500).json({ err });
  }
};

export { register, login, me, update, getStudents, addStudent, deleteStudent };

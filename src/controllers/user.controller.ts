import { Request, Response } from "express";
import User from "../models/user.model";

const CreateUserController = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body;
    const checkUserExist = await User.findOne({ auth0Id });

    if (checkUserExist) {
      return res.status(200).send(checkUserExist);
    }

    const newUserDetails = new User(req.body);
    await newUserDetails.save();

    res.status(201).json({
      status: "Success",
      data: newUserDetails,
    });
  } catch (error) {
    console.log(error?.toString());
    res.status(500).json({
      status: "Error",
      message: "Fill the form correctly",
    });
  }
};

export default { CreateUserController };

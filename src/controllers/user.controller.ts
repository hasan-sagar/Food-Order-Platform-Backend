import { Request, Response } from "express";
import User from "../models/user.model";

//create user
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

//update user
const UpdateUserController = async (req: Request, res: Response) => {
  try {
    const { name, addressLine1, city, country } = req.body;
    const checkUserExist = await User.findById(req.userId);

    if (!checkUserExist) {
      return res.status(404).json({
        status: "Error",
        message: "User Not Found",
      });
    }

    checkUserExist.name = name;
    checkUserExist.addressLine1 = addressLine1;
    checkUserExist.city = city;
    checkUserExist.country = country;

    await checkUserExist.save();
    res.status(201).json({
      status: "Success",
      data: checkUserExist,
    });
  } catch (error) {
    console.log(error?.toString());
    res.status(500).json({
      status: "Error",
      message: "Can't update user profile",
    });
  }
};

//get loggedin user
const GetLoggedInUser = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findById(req.userId);
    if (!currentUser) {
      return res.status(404).json({
        status: "Error",
        message: "User Not Found",
      });
    }
    res.status(201).json({
      status: "Success",
      data: currentUser,
    });
  } catch (error) {
    console.log(error?.toString());
    res.status(500).json({
      status: "Error",
      message: "User Not Found",
    });
  }
};

export default { CreateUserController, UpdateUserController, GetLoggedInUser };

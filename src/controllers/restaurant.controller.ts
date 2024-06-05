import { Request, Response } from "express";
import Restaurant from "../models/restaurant.model";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

//create new restaurant
const CreateRestaurant = async (req: Request, res: Response) => {
  try {
    const checkRestaurantExist = await Restaurant.findOne({
      user: req.userId,
    });

    if (checkRestaurantExist) {
      return res.status(409).json({
        status: "Error",
        message: "User restaurant already exist",
      });
    }

    const image = req.file as Express.Multer.File;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataUri = `data:${image.mimetype};base64,${base64Image}`;

    const uploadImageCloud = await cloudinary.v2.uploader.upload(dataUri);

    const restaurant = new Restaurant(req.body);
    restaurant.imageUrl = uploadImageCloud.url;
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.lastUpdated = new Date();
    await restaurant.save();

    res.status(201).json({
      status: "Success",
      data: restaurant,
    });
  } catch (error) {
    console.log(error?.toString());
    res.status(500).json({
      status: "Error",
      message: "Fill the form correctly",
    });
  }
};

const GetRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({
      user: req.userId,
    });
    if (!restaurant) {
      res.status(404).json({
        status: "Error",
        message: "Restaurant not found",
      });
    }
    res.status(200).json({
      status: "Success",
      data: restaurant,
    });
  } catch (error) {
    console.log(error?.toString());
    res.status(500).json({
      status: "Error",
      message: "Restaurant not found",
    });
  }
};

export default { CreateRestaurant, GetRestaurant };

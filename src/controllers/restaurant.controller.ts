import { Request, Response } from "express";
import Restaurant from "../models/restaurant.model";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import { UploadImageToCloudinary } from "../helpers/ImageUpload";

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

    const imageUrl = await UploadImageToCloudinary(
      req.file as Express.Multer.File
    );

    const restaurant = new Restaurant(req.body);
    restaurant.imageUrl = imageUrl;
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

//get user's restaurant
const GetRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({
      user: req.userId,
    });
    if (!restaurant) {
      return res.status(404).json({
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

//update restaurant
const updateRestaurant = async (req: Request, res: Response) => {
  try {
    const checkRestaurantExist = await Restaurant.findOne({
      user: req.userId,
    });

    if (!checkRestaurantExist) {
      return res.status(404).json({
        status: "Error",
        message: "Restaurant not found",
      });
    }

    checkRestaurantExist.restaurantName = req.body.restaurantName;
    checkRestaurantExist.city = req.body.city;
    checkRestaurantExist.country = req.body.country;
    checkRestaurantExist.deliveryPrice = req.body.deliveryPrice;
    checkRestaurantExist.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    checkRestaurantExist.cuisines = req.body.cuisines;
    checkRestaurantExist.menuItems = req.body.menuItems;
    checkRestaurantExist.lastUpdated = new Date();

    if (req.file) {
      const imageUrl = await UploadImageToCloudinary(
        req.file as Express.Multer.File
      );
      checkRestaurantExist.imageUrl = imageUrl;
    }

    await checkRestaurantExist.save();
    res.status(201).json({
      status: "Success",
      data: checkRestaurantExist,
    });
  } catch (error) {
    console.log(error?.toString());
    res.status(500).json({
      status: "Error",
      message: "Can't update the form . Try again",
    });
  }
};

//search restaurant
const RestaurantSearch = async (req: Request, res: Response) => {
  try {
    const city = req.params.city;

    const searchQueryKeywords = (req.query.searchQuery as string) || "";

    const selectedCuisines = (req.query.selectedCuisines as string) || "";

    const sortOption = (req.query.sortOption as string) || "lastUpdated";

    const page = parseInt(req.query.page as string) || 1;

    let query: any = {};

    query["city"] = new RegExp(city, "i");
    const checkCity = await Restaurant.countDocuments(query);
    if (checkCity === 0) {
      return res.status(404).json({
        status: "Error",
        message: "No Restaurant Found",
      });
    }

    if (selectedCuisines) {
      const cuisines = selectedCuisines
        .split(",")
        .map((cuisine) => new RegExp(cuisine, "i"));
      query["cuisines"] = { $all: cuisines };
    }

    if (searchQueryKeywords) {
      const searchKeyRegex = new RegExp(searchQueryKeywords, "i");
      query["$or"] = [
        { restaurantName: searchKeyRegex },
        { cuisines: { $in: [searchKeyRegex] } },
      ];
    }

    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const restaurants = await Restaurant.find(query)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await Restaurant.countDocuments(query);

    const response = {
      status: "Success",
      data: restaurants,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    console.log(error?.toString());
    res.status(500).json({
      status: "Error",
      message: "No search result found! Try again",
    });
  }
};

const GetSingleRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.restaurantId;
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        status: "Error",
        message: "No Restaurant Found",
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
      message: "No Resraurant found",
    });
  }
};

export default {
  CreateRestaurant,
  GetRestaurant,
  updateRestaurant,
  RestaurantSearch,
  GetSingleRestaurant,
};

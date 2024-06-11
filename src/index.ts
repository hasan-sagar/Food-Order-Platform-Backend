import express, { Response, Request } from "express";
import cors from "cors";
import "dotenv/config";
import DatabaseConnection from "./connections/database";
import UserRouter from "./routes/user.route";
import RestaurantRouter from "./routes/restaurant.route";
import OrderRouter from "./routes/order.route";
import { v2 as cloudinary } from "cloudinary";

//connect to database
DatabaseConnection();

//cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use("/api/v1/order/checkout/webhook", express.raw({ type: "*/*" }));
app.use(express.json());
app.use(cors());

//User routes
app.use("/api/v1/user", UserRouter);
//Restaurant routes
app.use("/api/v1/restaurant", RestaurantRouter);
//order routes
app.use("/api/v1/order", OrderRouter);

app.get("/", async (req: Request, res: Response) => {
  res.send({ message: "Hello From API" });
});

app.get("*", async (req: Request, res: Response) => {
  res.status(404).json("No Route Found");
});

//server port
const serverPort = process.env.SERVER_PORT;
app.listen(serverPort, () => {
  console.log(`Server start on port ${serverPort}`);
});

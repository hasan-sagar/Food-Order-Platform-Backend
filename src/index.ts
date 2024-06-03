import express, { Response, Request } from "express";
import cors from "cors";
import "dotenv/config";
import DatabaseConnection from "./connections/database";
import UserRouter from "./routes/user.route";

//connect to database
DatabaseConnection();

const app = express();
app.use(express.json());
app.use(cors());

//User routes
app.use("/api/v1/user", UserRouter);

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

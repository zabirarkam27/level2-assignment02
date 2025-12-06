import express, { Request, Response } from "express";
import dotenv from "dotenv";
import initDB from "./db/init";
import path from "path"

dotenv.config({path: path.join(process.cwd(), '.env')});

const app = express();
const port = 5000;

app.use(express.json());

initDB()
  .then(() => console.log("Database initialized successfully"))
  .catch((err: Error) => console.error("DB Initialization error:", err));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Lui Eye Kan");
});

app.post("/", (req: Request, res: Response) => {
  res.send("Post Request Received");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

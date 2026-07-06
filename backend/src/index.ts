import "dotenv/config";
import express from "express"
import { PORT } from "../config";
import authRouter from "./routes/auth.routes";
import { errorMiddleware } from "./middleware/errorMiddlware";

const app = express();

app.use(express.json());

app.use("/auth", authRouter);

console.log(process.env.DATABASE_URL);

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`server running on port: ${PORT}`);

})
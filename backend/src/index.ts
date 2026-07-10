import "dotenv/config";
import express from "express"
import { PORT } from "../config";
import { errorMiddleware } from "./middleware/errorMiddlware";
import issueRoutes from "./routes/issue.route";
import orgRoutes from "./routes/org.routes";
import authRoutes from "./routes/auth.routes";
import boardRoutes from "./routes/board.routes";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/org", orgRoutes);
app.use("/org/:orgId/boards", boardRoutes);
app.use("/org/:orgId/boards/:boardId/issues", issueRoutes)

console.log(process.env.DATABASE_URL);

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`server running on port: ${PORT}`);
})
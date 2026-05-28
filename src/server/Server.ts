import express from "express";
import cors from "cors"
import 'dotenv/config';
import './shared/services/TranslationsYup';
import { router } from "./routes";

const server = express();
server.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
server.use(express.json());
server.use(router);

export { server };
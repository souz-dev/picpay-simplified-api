import express from "express";
import { routeAdapters } from "./adapters/routeAdapters";
import { makeRegisterController } from "../application/factories/makeRegisterController";
import { makeTransferController } from "../application/factories/makeTransferController";

const server = express();
server.use(express.json());

server.post("/register-user", routeAdapters(makeRegisterController()));
server.post("/transfer", routeAdapters(makeTransferController()));
server.listen(3001, () => {
  console.log("Server started ");
});

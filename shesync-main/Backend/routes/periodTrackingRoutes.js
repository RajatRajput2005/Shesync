import express from "express";
import {
  periodTrackingController,
  trackerDataController,
  waterUpdateController,
} from "../controllers/periodTrackingController.js";
import { checkUser } from "../middlewares/checkUser.js";

const route = express.Router();

route.post("/trackerdata", checkUser, trackerDataController);
route.get("/periodtracking/:userId", checkUser, periodTrackingController);
route.get("/waterupdate/:userId", waterUpdateController);

export default route;

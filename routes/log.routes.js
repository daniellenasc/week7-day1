import express from "express";

import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import LogModel from "../model/log.model.js";

const logRoute = express.Router();

logRoute.get("/my-logs", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const logs = await LogModel.find({ user: req.currentUser._id }).populate(
      "user"
    );
    return res.status(201).json(logs);
  } catch (error) {
    return res.status(400).json(error);
  }
});

export default logRoute;

import express from "express";

import TaskModel from "../model/task.model.js";
import UserModel from "../model/user.model.js";

const taskRoute = express.Router();

//CREATE TASK
taskRoute.post("/create-task/:idUser", async (req, res) => {
  try {
    const { idUser } = req.params;

    const newTask = await TaskModel.create({ ...req.body, user: idUser });

    const userUpdated = await UserModel.findByIdAndUpdate(
      idUser,
      {
        $push: { tasks: newTask._id },
      },
      { new: true, runValidators: true }
    );

    return res.status(201).json(newTask);
  } catch (error) {
    return res.status(400).json(error.erros);
  }
});

//READ TASK
taskRoute.get("/oneTask/:idTask", async (req, res) => {
  try {
    const { idTask } = req.params;

    const oneTask = await TaskModel.findById(idTask).populate("user");

    return res.status(200).json(oneTask);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.errors);
  }
});

//READ ALL TASKS
taskRoute.get("/all-tasks", async (req, res) => {
  try {
    const allTasks = await TaskModel.find({}).populate("user");
    return res.status(200).json(allTasks);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.errors);
  }
});

//READ ALL TASK
taskRoute.put("/edit/:idTask", async (req, res) => {
  try {
    const { idTask } = req.params;
    const updatedTask = await TaskModel.findOneAndUpdate(
      { _id: idTask },
      { ...req.body },
      { new: true, runValidators: true }
    );
    return res.status(200).json(updatedTask);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.errors);
  }
});

//DELETE TASK
taskRoute.delete("/delete/:idTask", async (req, res) => {
  try {
    const { idTask } = req.params;

    //deletar a task
    const deletedTask = await TaskModel.findOneAndDelete(idTask);

    //atualizar o "tasks" do user (pelo id do user)
    await UserModel.findByIdAndUpdate(
      deletedTask.user,
      {
        $pull: {
          tasks: idTask,
        },
      },
      { new: true, runValidators: true }
    );
    return res.status(200).json(deletedTask);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.errors);
  }
});

export default taskRoute;

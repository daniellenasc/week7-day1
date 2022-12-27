import express from "express";

import TaskModel from "../model/task.model.js";
import UserModel from "../model/user.model.js";
import LogModel from "../model/log.model.js";

import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";

const taskRoute = express.Router();

//CREATE TASK
taskRoute.post("/create-task", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const newTask = await TaskModel.create({
      ...req.body,
      user: req.currentUser._id,
    });

    const userUpdated = await UserModel.findByIdAndUpdate(
      req.currentUser._id,
      {
        $push: { tasks: newTask._id },
      },
      { new: true, runValidators: true }
    );

    await LogModel.create({
      user: req.currentUser._id,
      task: newTask._id,
      status: "Uma nova tarefa foi criada",
    });

    return res.status(201).json(newTask);
  } catch (error) {
    return res.status(400).json(error.erros);
  }
});

//READ ALL MY TASKS
taskRoute.get("/my-tasks", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const allTasks = await TaskModel.find({
      user: req.currentUser._id,
    }).populate("user");
    return res.status(200).json(allTasks);
  } catch (error) {
    return res.status(400).json(error.erros);
  }
});

//EDIT TASK
taskRoute.put("/edit/:idTask", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const { idTask } = req.params;
    const updatedTask = await TaskModel.findOneAndUpdate(
      { _id: idTask },
      { ...req.body },
      { new: true, runValidators: true }
    );

    await LogModel.create({
      user: req.currentUser._id,
      task: idTask,
      status: `A tarefa "${updatedTask.details}" foi atualizada`,
    });

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.errors);
  }
});

//rota para concluir a task
taskRoute.put(
  "/complete/:idTask",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { idTask } = req.params;

      const task = await TaskModel.findByIdAndUpdate(
        idTask,
        {
          complete: true,
          dateFin: Date.now(),
        },
        { new: true, runValidators: true }
      );

      await LogModel.create({
        user: req.currentUser._id,
        task: idTask,
        status: `A tarefa "${task.details}" foi concluída`,
      });

      return res.status(200).json(task);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error.errors);
    }
  }
);

//DELETE TASK
taskRoute.delete(
  "/delete/:idTask",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
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

      await LogModel.create({
        task: idTask,
        user: req.currentUser._id,
        status: `A tarefa "${deletedTask.details}" foi excluída com o status ${deletedTask.status}`,
      });

      return res.status(200).json(deletedTask);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error.errors);
    }
  }
);

export default taskRoute;

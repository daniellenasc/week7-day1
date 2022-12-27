import { Schema, model } from "mongoose";

//criando o Schema:
const taskSchema = new Schema(
  {
    details: { type: String, required: true },
    complete: { type: Boolean, default: false },
    dateFin: { type: Date },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    collab: [{ type: Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["criada", "iniciada", "finalizando"],
      default: "criada",
    },
  },
  { timestamps: true }
);

const TaskModel = model("Task", taskSchema);

export default TaskModel;

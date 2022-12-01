import { Schema, model } from "mongoose";

//criando o Schema:
//userSchema é um objeto que estará instanciando a classe Schema,
//o Schema receberá um objeto de parâmetro, como se fosse o 'constructor' de uma classe, e esse objeto conterá os campos que queremos guardar
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 20,
      lowercase: true,
    },

    age: {
      type: Number,
      min: 18,
      max: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
    },

    role: {
      type: String,
      enum: ["professora", "aluno", "ta"],
      default: "aluno",
    },

    active: {
      type: Boolean,
      default: true,
    },

    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],

    birth: { type: Date },

    adress: {
      city: { type: String },
      state: { type: String },
    },
  },
  { timestamps: true }
);

//modelo da collection:
//model(1º parâmetro: "nome do modelo"(nome do arquivo - primeira letra em maiúsculo e no singulat), 2º Parâmetro: o schema)
// = exportando um modelo (.model), que tem o nome "Content" (1º parâmetro), e segue a receita do contentScheema (2º parâmetro)
const UserModel = model("User", userSchema);

export default UserModel;

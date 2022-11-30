import express from "express";

//o roteador
const userRoute = express.Router();

//importar o userModel:
import UserModel from "../model/user.model.js";

//SIMULANDO UM BANCO DE DADOS:
const bancoDados = [
  {
    id: "718ef24c-d248-49ee-90a5-7a205ce87fb2",
    name: "Danielle Nascimento",
    age: 33,
    role: "TA",
    active: true,
    tasks: ["fazer chamada", "liberar calendly"],
  },
];

//7. criar as ROTAS:

//GET ALL
//dois parâmetros: 1) caminho, rota; 2) callback - recebe dois argumentos: req (request => requisições do cliente) e res (response => a resposta para o cliente)
/* userRoute.get("/enap", (req, res) => {
  const bemVindo = "Bem vindo ao servidor da Enap turma 92 - IRONHACK";
  //retorna uma resposra com status de 200 e um JSON
  return res.status(200).json(bemVindo);
}); */

//CRIAR UMA ROTA QUE RETORNA BANCO DE DADOS
/* userRoute.get("/all-users", (req, res) => {
  return res.status(200).json(bancoDados);
}); */

//CREATE (NOVO USUÁRIO) NO MONGODB
//A CALLBACK É ASSÍNCRONA!!
userRoute.post("/create-user", async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: "Algo deu errado na criação do usuário." });
  }
});

//CREATE USER
userRoute.post("/new-user", (req, res) => {
  //console.log(req.body); //corpo da requisição (JSON) = É UM OBJETO, sendo possível acessar partes do objetos (req.body.name)

  const form = req.body;
  bancoDados.push(form);

  return res.status(201).json(bancoDados);
});

//DELETE USER
userRoute.delete("/delete/:id", (req, res) => {
  // console.log(re.params.id) //req.params -> {} por isso ele pode ser DESCONSTRUÍDO
  const { id } = req.params; // estou DESCONSTRUINDO o req.params e ABRINDO o obj e acessando pelo NOME da chave
  //console.log(id);

  //achando o id do usuario:
  const deleteById = bancoDados.find((user) => user.id === id);
  console.log(deleteById);
  //achar o index do usuario dentro da array
  const index = bancoDados.indexOf(deleteById);
  console.log(index);
  //removendo o usuario com o slice()
  bancoDados.splice(index, 1);

  return res.status(200).json(bancoDados);
});

//PUT - EDITAR:
userRoute.put("/edit/:id", (req, res) => {
  const { id } = req.params;

  const editUser = bancoDados.find((user) => user.id === id);
  const index = bancoDados.indexOf(editUser); // 0

  bancoDados[index] = {
    ...editUser,
    ...req.body,
  };

  return res.status(200).json(bancoDados[index]);
});

export default userRoute;

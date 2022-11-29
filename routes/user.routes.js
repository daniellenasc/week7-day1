import express from "express";

//o roteador
const userRoute = express.Router();

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
userRoute.get("/enap", (req, res) => {
  const bemVindo = "Bem vindo ao servidor da Enap turma 92 - IRONHACK";
  //retorna uma resposra com status de 200 e um JSON
  return res.status(200).json(bemVindo);
});

//CRIAR UMA ROTA QUE RETORNA BANCO DE DADOS
userRoute.get("/all-users", (req, res) => {
  return res.status(200).json(bancoDados);
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
//app.put("/edit/:id", (req, res) => {});

export default userRoute;

import express from "express";
import UserModel from "../model/user.model.js";
import TaskModel from "../model/task.model.js";
import bcrypt from "bcrypt";
import generateToken from "../config/jwt.config.js";

//o roteador
const userRoute = express.Router();

//7. criar as ROTAS:

const saltRounds = 10; //quantidade de caracteres a serem adicionados no salt (10 é padrão)

//ROTA SIGN-UP
userRoute.post("/sign-up", async (req, res) => {
  try {
    //capturando a senha do req.body
    const { password } = req.body;

    // checando se a senha existe || se tem 8 caracteres, maísculos e minúsculo e caracteres especiais
    if (
      !password ||
      password.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#!])[0-9a-zA-Z$*&@#!]{8,}$/
      )
    ) {
      return res
        .status(400)
        .json({ msg: "Senha não tem os requisitos mínimos de segurança" });
    }

    //pegar o salt - qdo for usar o bcrypt, usar o await
    const salt = await bcrypt.genSalt(saltRounds); //10

    //hashear senha
    // .hash() recebe dois argumentos:
    // 1) o que você quer hashear
    // 2) o salt
    const hashedPassword = await bcrypt.hash(password, salt);

    //criar o usuário com a senha hasheada:
    const newUser = await UserModel.create({
      ...req.body,
      passwordHash: hashedPassword,
    });

    //deletar a propriedade passwordHash do usuário da resposta p/ o cliente, para que essa informação sensível não fique transitando (no banco de dados, ainda existe)
    delete newUser._doc.passwordHash;

    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

// ROTA LOG IN
userRoute.post("/login", async (req, res) => {
  try {
    //capturando o email e o password do req.body
    const { email, password } = req.body;

    //achar o usuário no banco de dados pelo email
    const user = await UserModel.findOne({ email: email });

    //checar se o email existe no banco de dados
    if (!user) {
      return res.status(400).json({ msg: "Usuário não cadastrado" });
    }

    //comparar a senha que o usuário enviou com a senha hasheada que está no banco de dados
    //bcrypt tem um método chamado compare():
    // 1) senha que o usuário enviou
    // 2) senha hasheada
    if (await bcrypt.compare(password, user.passwordHash)) {
      //se a comparação for true, cai dentro desse if, ou seja, as senhas são iguais, ou seja, tenho que devolver pro usuário um TOKEN de acesso

      //apagar a senha hasheada p/ não transitar informação sensível
      delete user._doc.passwordHash;

      //criar um token para o usuário logado
      const token = generateToken(user);

      return res.status(200).json({
        user: user,
        token: token,
      });
    } else {
      //se a comparação for FALSE, cai dentro desse else, ous seja, as senhas não são iguais
      return res.status(401).json({ msg: "Email ou senha inválida" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

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
//

//TODOS OS USUÁRIOS NO MONGODB
//A CALLBACK É ASSÍNCRONA!!
//no insomnia: GET http://localhost:8080/user/all-users

userRoute.get("/all-users", async (req, res) => {
  try {
    // find vazio -> todas as ocorrencias
    // projections -> define os campos que vão ser retornados
    // sort() -> ordenada o retorno dos dados
    // limit() -> define quantas ocorrencias serão retornadas
    const users = await UserModel.find({}, { __v: 0, updatedAt: 0 })
      .sort({
        age: 1,
      })
      .limit(100);

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

//CREATE USER
/* userRoute.post("/new-user", (req, res) => {
  //console.log(req.body); //corpo da requisição (JSON) = É UM OBJETO, sendo possível acessar partes do objetos (req.body.name)

  const form = req.body;
  bancoDados.push(form);

  return res.status(201).json(bancoDados);
}); */

//CREATE (NOVO USUÁRIO) NO MONGODB
//A CALLBACK É ASSÍNCRONA!!
//no insomnia: POST http://localhost:8080/user/create-user
/* userRoute.post("/create-user", async (req, res) => {
  try {
    //tudo o que passar dentro do create vai ser o corpo do que será criado
    //UserModel é a porta de entrada para a collection User (é o mongoose)
    const form = req.body;

    const newUser = await UserModel.create(form);
    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.errors);
  }
}); */

//GET ONE USER NO MONGODB
//fundById() é um método do mongoose
//A CALLBACK É ASSÍNCRONA!!
//no insomnia: POST http://localhost:8080/user/oneUSer/:id
userRoute.get("/oneUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id).populate("tasks");

    //caso o id não exista na coleção
    if (!user) {
      return res.status(400).json({ msg: "Usuário não encontrado" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.errors);
  }
});

//DELETE USER
/* userRoute.delete("/delete/:id", (req, res) => {
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
}); */

//DELETAR USER NO MONGODB
//A CALLBACK É ASSÍNCRONA!!
//no insomnia: POST http://localhost:8080/user/delete/:id

userRoute.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await UserModel.findByIdAndDelete(id);

    //caso o id não exista na coleção
    if (!deletedUser) {
      return res.status(400).json({ msg: "Usuário não encontrado" });
    }

    const users = await UserModel.find();

    //deletar todas as tasks do usuário que foi deletado
    await TaskModel.deleteMany({ user: id });

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.errors);
  }
});

//PUT - EDITAR:
/* userRoute.put("/edit/:id", (req, res) => {
  const { id } = req.params;

  const editUser = bancoDados.find((user) => user.id === id);
  const index = bancoDados.indexOf(editUser); // 0

  bancoDados[index] = {
    ...editUser,
    ...req.body,
  };

  return res.status(200).json(bancoDados[index]);
}); */

//ATUALIZAR USER NO MONGODB
//A CALLBACK É ASSÍNCRONA!!
//no insomnia: POST http://localhost:8080/user/edit/:id
userRoute.put("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    //findByIdAndUpdate recebe 3 parâmetros:
    //o filtro -> id
    //as modificações -> {...req.body}
    //um objeto de configuração {new: true, runValidators: true}
    //new: true → retorna o documento atualizado
    //runValidators → roda as validações definidas no schema
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.errors);
  }
});

export default userRoute;

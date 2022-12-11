// middleware que:
// 1. consome as informações de req.auth (do isAuth)
// 2. com o _id, acha o usuário dono do token
//3. cria a chave req.currentUser, de onde vai pegar todas as informações do usuário
// 3. next()

import UserModel from "../model/user.model.js";
async function attachCurrentUser(req, res, next) {
  try {
    //consumindo as informaçõesde req.auth
    const userData = req.auth; // -> _id, email, role

    //achando o usuário dono do token pelo _id
    const user = await UserModel.findById(userData._id, { passwordHash: 0 });

    //confirmar se o user existe
    if (!user) {
      return res.status(400).json({ msg: "Usuário não encontrado" });
    }

    //criando a chave req.currentUser, de onde vai pegar todas as informações do usuário
    req.currentUser = user;

    //passa para o próximo
    next();
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
}

export default attachCurrentUser;

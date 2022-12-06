import UserModel from "../model/user.model.js";
//middleware
//next entrega a req para o próximo
async function attachCurrentUser(req, res, next) {
  try {
    const userData = req.auth; // -> _id, email, role

    const user = await UserModel.findById(userData._id, { passwordHash: 0 });

    //confirmar se o user existe
    if (!user) {
      return res.status(400).json({ msg: "Usuário não encontrado" });
    }

    //eu posso criar CHAVES dentro dessa requisição
    req.currentUser = user;

    //passa para o próximo
    next();
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
}

export default attachCurrentUser;

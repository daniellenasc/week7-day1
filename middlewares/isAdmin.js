//middleware para saber se o role do user é ADMIN
//como esse middleware virá depois do isAuth, o req.auth já terá sido criado e por ele vai ser feita a verificação

function isAdmin(req, res, next) {
  if (req.auth.role !== "ADMIN") {
    return res
      .status(401)
      .json({ msg: "Usuário não autorizado para esta rota!" });
  }
  next();
}

export default isAdmin;

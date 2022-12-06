import { expressjwt } from "express-jwt";
import * as dotenv from "dotenv";

dotenv.config();

export default expressjwt({
  secret: process.env.TOKEN_SIGN_SECRET,
  algorithms: ["HS256"],
});

//quando a requisição passar por esse middleware, será criada uma chave chamada "AUTH", ou seja, será criada uma chave chamada req.auth, que vai ter dentro o payload (email, _id, role)

import express from "express";
import uploadImg from "../config/cloudinary.config.js";

//roteador
const uploadRoute = express.Router();

//rota de post porque estamos enviando a imagem
//o multer (= uploadImg) é um middleware, então deve estar entre a rota e a callback
// uploadImg já vai fazer o upload da imagem e voltar com a URL
uploadRoute.post("/upload", uploadImg.single("picture"), (req, res) => {
  // onde está o arquivo que eu acabei de fazer o upload o cloudnary?
  // req.file -> que está as informações da foto carregada

  //confirmar que a imagem foi carregada corretamente
  if (!req.file) {
    return res.status(400).json({ msg: "Upload Fail" });
  }

  return res.status(201).json({ url: req.file.path });
});

export default uploadRoute;

//configurando o cloudinary
// https://cloudinary.com/documentation/image_upload_api_reference
// https://www.npmjs.com/package/multer-storage-cloudinary

import cloudinary from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import * as dotenv from "dotenv";

dotenv.config();

//instanciar o cloudinary:
const cloudinaryInst = cloudinary.v2;

//CONECTANDO COM O CLOUDINARY
cloudinaryInst.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

//configurando o meu cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryInst, //a instância
  params: {
    folder: "enap-92", //nome da pasta
    format: async (req, res) => "png", //formato do que será guardado (pode ser jpeg tbm)
    use_filename: true, //o nome que vier da imagem é o nome que será guardado
  },
});

//o multer é um middleware, que vai pegar a imagem enviada o front, e transformar em algo que o Cloudinary vai aceitar
const uploadImg = multer({ storage: storage });

export default uploadImg;

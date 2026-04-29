import multer from "multer";
import { storage } from "../configs/cloudinary.config.js";

const upload = multer({ storage });

export default upload;

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import mime from "mime-types";
import auth from "./routes/userAuth.js";
import ogretmen from "./routes/ogretmenIslemleri.js";
import ogrenci from "./routes/ogrenciIslemleri.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
// app.use(bodyParser.json({ limit: "30mb", extended: true }));
// app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// app.use("/admin", admins);
// app.use("/home", homeilan);
app.use("/auth", auth);
app.use("/ogretmen", ogretmen);
app.use("/ogrenci",ogrenci)
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () =>
      console.log("Server çalışıyor: http://localhost:3001")
    );
  })
  .catch((error) => console.log(error));

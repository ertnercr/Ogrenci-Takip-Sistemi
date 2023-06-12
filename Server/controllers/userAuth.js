import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ogretmen from "../models/Ogretmen.js";
import ogrenci from "../models/Ogrenci.js";
import dotenv from "dotenv"
dotenv.config();
const keysecret = process.env.SECRET_KEY;

function formatDate(date) {
  const yil = date.getUTCFullYear();
  const ay = date.getUTCMonth();
  const gun = date.getUTCDate();
  const tarih = `${gun}/${ay + 1}/${yil}`;
  return tarih;
}
//-------------------------------------------------------------------------------------------LOGİN-----------------------------------------------------------------------------------------------
export const teacherLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("email:",username)
    console.log("pw:",password)
   
    const existingUser = await ogretmen.findOne({ nickname: username });
    console.log("user:",existingUser)
    if (!existingUser)
      return res.status(400).json({ message: "Öğretmen Kaydı Bulunamadı." });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Şifreyi yanlış girdiniz. Lütfen kontrol edin." });

    const token = jwt.sign({ id: existingUser._id }, keysecret);
    console.log(token);
    res.status(200).json({ token, user: existingUser.tur, message: "Giriş Başarılı."});
  } catch (error) {
    res.status(500).json({ message: "Giriş Yaparken Bir Sorun Oluştu." });
    console.log("x",error.message)
  }
};

//-------------------------------------------------------------------------------------------LOGİN-----------------------------------------------------------------------------------------------

export const stdLogin = async (req, res) => {
  try {
    const { tcno, password } = req.body;
    const existingUser = await ogrenci.findOne({ tcno: tcno });
    if (!existingUser)
      return res
        .status(400)
        .json({ message: "Öğrenci Kaydı Bulunamadı. Öğretmeninize danışın." });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({
        message:
          "Şifreyi yanlış girdiniz. Lütfen kontrol edin. Eğer doğru girdiğinizi düşünüyorsanız öğretmeninize danışın.",
      });

    const token = jwt.sign({ id: existingUser._id }, keysecret);
    res
      .status(200)
      .json({ token, user: existingUser.tur, message: "Giriş Başarılı." });
  } catch (error) {
    res.status(500).json({ message: "Giriş Yaparken Bir Sorun Oluştu." });
    console.log(error.message)
  }
};
//-------------------------------------------------------------------------------------------LOGİN-----------------------------------------------------------------------------------------------

////-------------------------------------------------------------------------------------------SİGNUP-----------------------------------------------------------------------------------------------

export const teacherSignup = async (req, res) => {
  try {
    const { fullName, username, password, telefonNo, tcKimlikNo } = req.body;

    console.log(fullName, username, password, telefonNo, tcKimlikNo);
    const existingUser = await ogretmen.findOne({ nickname: username });
    if (existingUser)
      return res.status(400).json({ message: "Email adresi kayıtlıdır." });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const bugun = new Date();
    const kayit_tarihi = formatDate(bugun);
    console.log(kayit_tarihi);

    const newOgretmen = new ogretmen({
      fullname: fullName,
      nickname: username,
      password: passwordHash,
      phone: telefonNo,
      tcno: tcKimlikNo,
      regDate: kayit_tarihi,
    });

    await newOgretmen.save();
    res.status(200).json({ message: "Kayıt İşlemi Başarıyla Tamamlandı." });
  } catch (error) {
    console.log(error);

    res.status(400).json({ message: "Öğretmen Kayıt Edilemedi." });
  }
};

////-------------------------------------------------------------------------------------------SİGNUP-----------------------------------------------------------------------------------------------
export const stdSignup = async (req, res) => {
  try {
    const { fullname, ogretmen_id, veliTel, tcno } = req.body;

    const existingUser = await ogrenci.findOne({ tcno: tcno });

    if (existingUser) {
      return res.status(400).json({ message: "Bu öğrenci zaten kayıtlıdır." });
    }
    let new_number;
    do {
      new_number = Math.floor(Math.random() * 10000);
      ogr_controller = ogrenci.findOne({ studentNumber: new_number });
    } while (!ogr_controller);

    const bugun = new Date();
    const kayit_tarihi = formatDate(bugun);

    const newOgrenci = new ogrenci({
      fullname,
      studentNumber: new_number,
      ogretmen_id,
      tcno,
      regDate: kayit_tarihi,
      veliTel,
    });

    await newOgrenci.save();
    res.status(200).json({ message: "Kayıt İşlemi Başarıyla Tamamlandı." });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Öğrenci kayıt edilirken bir sorunla karşılaşıldı." });
  }
};

export const stdDelete = async (req, res) => {
  try {
    const { studentNumber } = req.body;

    const existingUser = await ogrenci.findOneAndDelete({
      studentNumber: studentNumber,
    });
    if (existingUser) {
      return res.status(200).json({
        message: `${existingUser.fullname} adlı öğrenci başarıyla silinmiştir.`,
      });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Öğrenci Silinirken Bir Sorun Çıktı." });
  }
};
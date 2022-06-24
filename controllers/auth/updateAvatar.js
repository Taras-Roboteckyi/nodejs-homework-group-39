const Jimp = require("jimp");

const { User } = require("../../models/user");

const path = require("path");
const fs = require("fs/promises");

const avatarDir = path.join(__dirname, "../../", "public", "avatars");

const updateAvatar = async (req, res, next) => {
  
  const { path: tempUpload, originalname } = req.file;

  const { _id: id } = req.user;
  const imageName = `${id}_${originalname}`; // робим унікальне імя картинці щоб не було повторень

  try {
    const resultUpload = path.join(avatarDir, imageName); // зшиваєм шлях + оригінальне імя картинки

    const image = await Jimp.read(tempUpload); // змінюєм розміри картинки через пакет Jimp
    await image.cover(250, 250);
    await image.writeAsync(tempUpload); // save

    await fs.rename(tempUpload, resultUpload); // переміщаєм з папки tmp в папку public
    const avatarURL = path.join("public", "avatars", imageName); // записуєм новий  шлях картинки
    await User.findByIdAndUpdate(req.user._id, { avatarURL }); // обновляєм в БД avatar

    res.json({
      status: "success",
      code: 200,
      avatarURL,
    });
  } catch (error) {
    await fs.unlink(tempUpload); // удаляєм шлях
    throw error;
  }
};

module.exports = updateAvatar;

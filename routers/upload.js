const express = require("express");
const multer = require("multer");
const { auth } = require("../helpers/auth");

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: "images",
    filename(req, file, done) {
      const name = Date.now() + "-" + file.originalname;
      done(null, name);
    },
  }),
});

router.post("/upload/file", upload.single("data"), async (req, res) => {
  console.log(req.file);
  res.send();
});

router.post(
  "/upload/avatar",
  auth(),
  upload.single("data"),
  async (req, res) => {
    const { path } = req.file;
    req.user.avatar = path;
    const result = await req.user.save();
    res.send(result);
  }
);

module.exports = router;

const express = require("express");
const router = express.Router();
var multer = require("multer");
var upload = multer({ dest: "src/uploads" });

const { uploadImage, uploadKhususAddBook } = require("../middleware/upload");

const {
  getUser,
  detailUser,
  updatePhotoProfile,
  getUserLiterature,
} = require("../controller/user");

const { register, login, checkAuth } = require("../controller/auth");
const {
  getLiterature,
  getLiteratureByTitle,
  getDetailLiterature,
} = require("../controller/literature");

const { myLiterature } = require("../controller/collection");

const { authenticated } = require("../middleware/authentication");

router.get("/users", getUser);
router.get("/profile/:id", detailUser);
router.get("/profile/:id/literature", getUserLiterature);
router.patch(
  "/edit_photo",
  uploadImage("photoProfile"),
  authenticated,
  updatePhotoProfile
);

router.post("/register", register);
router.post("/login", login);
router.get("/auth", authenticated, checkAuth);

// router.get("/books", getBooks);
// router.get("/book/:id", detailBooks);
// router.post("/book", uploadKhususAddBook(), authenticated, addBooks);
// router.delete("/book/:id", authenticated, deleteBooks);
// router.patch("/book/:id", authenticated, updateBooks);

router.get("/literatures", authenticated, getLiterature);
router.get("/literature", authenticated, getLiteratureByTitle);
router.get("/literature/:id", authenticated, getDetailLiterature);

router.get("/collection/:id", authenticated, myLiterature);

// router.get("/my-library", authenticated, myLibrary);
// router.post("/my-library", authenticated, addLibrary);
// router.delete("/my-library/:id", authenticated, deleteLibrary);

module.exports = router;

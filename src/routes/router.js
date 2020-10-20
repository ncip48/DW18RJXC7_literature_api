const express = require("express");
const router = express.Router();

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
  addLiterature,
  updateLiterature,
} = require("../controller/literature");

const {
  myCollection,
  addCollection,
  deleteCollection,
} = require("../controller/collection");

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
router.post("/literature", uploadKhususAddBook(), authenticated, addLiterature);
router.get("/literature/:id", authenticated, getDetailLiterature);
router.patch("/literature/:id", authenticated, updateLiterature);

router.get("/collection/:id", authenticated, myCollection);
router.post("/collection/", authenticated, addCollection);
router.delete("/collection/:id", authenticated, deleteCollection);

// router.get("/my-library", authenticated, myLibrary);
// router.post("/my-library", authenticated, addLibrary);
// router.delete("/my-library/:id", authenticated, deleteLibrary);

module.exports = router;

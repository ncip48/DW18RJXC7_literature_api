var multer = require("multer");
const { cloudinary } = require("../../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

exports.uploadImage = (fileName) => {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "src/uploads/img");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      req.fileValidationError = {
        message: "Only image files are allowed!",
      };
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  };

  const maxSize = 2 * 1000 * 1000;

  const upload = multer({
    storage,
    fileFilter: imageFilter,
    limits: {
      fileSize: maxSize,
    },
  }).single(fileName);

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError)
        return res.status(400).send(req.fileValidationError);

      if (!req.file && !err)
        return res.status(400).send({
          message: "Please select an image to upload",
        });

      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: "Max file sized 2MB",
          });
        }
        return res.status(400).send(err);
      }

      return next();
    });
  };
};

exports.uploadBook = (thumbnail) => {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "src/uploads/books");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  const pdfFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(epub|pdf|EPUB|PDF)$/)) {
      req.fileValidationError = {
        message: "Only pdf/epub files are allowed!",
      };
      return cb(new Error("Only pdf/epub files are allowed!"), false);
    }
    cb(null, true);
  };

  //const maxSize = 2 * 1000 * 1000;

  const upload = multer({
    storage,
    fileFilter: pdfFilter,
    // limits: {
    //   fileSize: maxSize,
    // },
  }).single(thumbnail);

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError)
        return res.status(400).send(req.fileValidationError);

      if (!req.file && !err)
        return res.status(400).send({
          message: "Please select an pdf/epub to upload",
        });

      return next();
    });
  };
};

exports.uploadKhususAddBook = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      file.fieldname === "thumbnail"
        ? cb(null, "src/uploads/img")
        : cb(null, "src/uploads/books");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  var cpUpload = multer({
    storage: storage,
  }).fields([{ name: "thumbnail" }, { name: "attache" }]);

  return (req, res, next) => {
    cpUpload(req, res, function (err) {
      return next();
    });
  };
};

exports.cloudUpload = (fieldName) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
      return {
        folder: `literature/${file.fieldname}s`,
        public_id: file.fieldname + "-" + Date.now(),
        transformation: { flags: "attachment", fetch_format: "auto" },
        format: "pdf",
      };
    },
  });

  const fileFilter = (req, file, cb) => {
    if (file.fieldname === "attache") {
      fileType = "pdf";
      limitSize = "5 MB";
    } else {
      fileType = "image";
      limitSize = "2 MB";
    }

    if (!file.mimetype.match(fileType)) {
      req.fileValidationError = {
        status: "fail",
        message: `Please select a ${fileType} file!`,
        code: 400,
      };
      return cb(new Error(`Please select an ${fileType} file!`), false);
    }

    cb(null, true);
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1000 * 1000,
    },
  }).single(fieldName);

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (req.fileValidationError)
        return res.status(400).send(req.fileValidationError);

      if (!req.file && !req.files && !err)
        return res.status(400).send({
          status: "fail",
          message: "Please select a file to upload",
          code: 400,
        });

      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            status: "fail",
            message: `Max file sized ${limitSize}`,
            code: 400,
          });
        }
        return res.status(400).send(err);
      }

      return next();
    });
  };
};

exports.cloudinary = (fieldName) => {
  cloudinary.uploader.upload(
    "dog.mp4",
    {
      // public_id: "my_folder/my_sub_folder/my_dog",
      folder: `literature/${file.fieldname}s`,
      public_id: file.fieldname + file.originalname + "-" + Date.now(),
      flag,
    },
    function (error, result) {
      console.log(result, error);
    }
  );
};

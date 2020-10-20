const { Literature, Collection, User } = require("../../models");

exports.myLiterature = async (req, res) => {
  try {
    const { id } = req.user;
    const collection = await Collection.findAll({
      include: {
        model: Literature,
        as: "literatures",
        include: {
          model: User,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        attributes: {
          exclude: [
            "id_category",
            "userId",
            "createdAt",
            "updatedAt",
            "publication",
            "pages",
            "ISBN",
            "aboutBook",
            "file",
          ],
        },
      },
      where: {
        userId: id,
      },
      attributes: {
        exclude: ["literatureId", "userId", "createdAt", "updatedAt"],
      },
    });
    res.send({
      message: `Your collection has been successfully loaded`,
      data: {
        collections: collection,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: {
        message: "Server ERROR",
      },
    });
  }
};

exports.addLibrary = async (req, res) => {
  try {
    const { id } = req.user;

    //check if books already in library
    const check = await Collection.findOne({
      where: {
        userId: req.user.id,
        bookId: req.body.bookId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    //if already then
    if (check) {
      return res.status(400).send({
        error: {
          message: "Books has been already added to library",
        },
      });
    }

    //if not in library
    await Collection.create({
      userId: req.user.id,
      bookId: req.body.bookId,
    });
    res.send({
      message: "Your Literature has been added successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: {
        message: "Server ERROR",
      },
    });
  }
};

exports.deleteLibrary = async (req, res) => {
  try {
    const { id } = req.user;
    await Collection.destroy({
      where: {
        userId: req.user.id,
        bookId: req.params.id,
      },
    });
    res.send({
      message: "Your Literature has been successfully removed from library",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: {
        message: "Server ERROR",
      },
    });
  }
};

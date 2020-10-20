const { Literature, Category, User } = require("../../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.getLiterature = async (req, res) => {
  try {
    const literature = await Literature.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["CategoryId", "UserId", "createdAt", "updatedAt"],
      },
      order: [["id", "DESC"]],
    });
    res.send({
      message: "Literature loaded successfully",
      data: {
        literatures: literature,
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

exports.getLiteratureByTitle = async (req, res) => {
  let title = req.query.title;
  let public_year = req.query.public_year;
  try {
    if (public_year) {
      const literature = await Literature.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        attributes: {
          exclude: ["CategoryId", "UserId", "createdAt", "updatedAt"],
        },
        where: {
          title: {
            [Op.like]: "%" + title + "%",
          },
          publication_date: {
            [Op.like]: "%" + public_year + "%",
          },
        },
        order: [["id", "DESC"]],
      });
      res.send({
        message: `Literature with title like ${title} and date like ${public_year} loaded successfully`,
        data: {
          literatures: literature,
        },
      });
    } else {
      const literature = await Literature.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        attributes: {
          exclude: ["CategoryId", "UserId", "createdAt", "updatedAt"],
        },
        where: {
          title: {
            [Op.like]: "%" + title + "%",
          },
        },
        order: [["id", "DESC"]],
      });
      res.send({
        message: `Literature with title like ${title} loaded successfully`,
        data: {
          literatures: literature,
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: {
        message: "Server ERROR",
      },
    });
  }
};

exports.getDetailLiterature = async (req, res) => {
  try {
    const { id } = req.params;
    const literature = await Literature.findOne({
      include: [
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: [
          "CategoryId",
          "UserId",
          "id_user",
          "id_category",
          "createdAt",
          "updatedAt",
        ],
      },
      where: {
        id,
      },
    });
    res.send({
      message: `Literature with id ${id} loaded successfully`,
      data: {
        literature: literature,
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

exports.addBooks = async (req, res) => {
  const { role } = req.user;
  const { id } = req.user;
  try {
    const {
      title,
      publication,
      pages,
      ISBN,
      id_category,
      aboutBook,
      status,
    } = req.body;
    const thumbnail = req.files["thumbnail"][0].filename;
    const file = req.files["file"][0].filename;
    const books = await Literature.create({
      title,
      publication,
      id_category,
      id_user: id,
      pages,
      ISBN,
      aboutBook,
      file,
      thumbnail,
      status:
        status === null || status === ""
          ? role === 1
            ? "Approved"
            : "Waiting"
          : status,
    });

    if (books) {
      const bookResult = await Literature.findOne({
        where: {
          id: books.id,
        },
        include: [
          {
            model: Category,
            as: "category",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model: User,
            as: "userId",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        attributes: {
          exclude: [
            "CategoryId",
            "UserId",
            "id_user",
            "id_category",
            "createdAt",
            "updatedAt",
          ],
        },
      });
      res.send({
        message: `Books successfully added`,
        data: {
          Literature: bookResult,
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: {
        message: "Server ERROR",
        error: err.message,
      },
    });
  }
};

exports.updateBooks = async (req, res) => {
  try {
    const { id } = req.params;
    const Literature = await Literature.update(req.body, {
      where: {
        id,
      },
    });
    if (Literature) {
      const bookResult = await Literature.findOne({
        where: {
          id,
        },
        include: [
          {
            model: Category,
            as: "category",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model: User,
            as: "userId",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        attributes: {
          exclude: [
            "CategoryId",
            "UserId",
            "id_user",
            "id_category",
            "createdAt",
            "updatedAt",
          ],
        },
      });
      res.send({
        message: `Books with id ${id} has been successfully edited`,
        data: {
          books: bookResult,
        },
      });
    } else {
      res.status(400).send({
        message: "Error while updating books",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: {
        message: "Server ERROR",
        error: err.message,
      },
    });
  }
};

exports.deleteBooks = async (req, res) => {
  try {
    const { id } = req.params;
    await Literature.destroy({
      where: {
        id,
      },
    });
    res.send({
      message: `Literature with id ${id} has been removed successfully`,
      data: {
        id,
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

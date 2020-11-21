const { Literature, Category, User } = require("../../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.getLiterature = async (req, res) => {
  let { status } = req.query;
  try {
    if (status) {
      const literature = await Literature.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: {
              exclude: ["createdAt", "updatedAt", "password"],
            },
          },
        ],
        attributes: {
          exclude: ["CategoryId", "UserId", "createdAt", "updatedAt"],
        },

        where: {
          status: {
            [Op.like]: "%" + status + "%",
          },
        },
        order: [["id", "DESC"]],
      });
      res.send({
        message: "Literature loaded successfully",
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
              exclude: ["createdAt", "updatedAt", "password"],
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

    if (!literature) {
      return res.status(500).send({
        error: {
          message: `Literatures not found with id ${id}`,
        },
      });
    }

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

exports.addLiterature = async (req, res) => {
  const { role } = req.user;
  const { id } = req.user;
  try {
    const { title, publication_date, pages, isbn, author, status } = req.body;
    const thumbnail = req.files["thumbnail"][0].filename;
    const attache = req.files["attache"][0].filename;

    const checkISBN = await Literature.findOne({
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
        isbn: req.body.isbn,
      },
    });

    if (checkISBN) {
      return res.status(500).send({
        error: {
          message: "ISBN already exist",
        },
      });
    }

    const literature = await Literature.create({
      title,
      publication_date,
      userId: id,
      pages,
      isbn,
      author,
      attache,
      thumbnail,
      status:
        status === null || status === ""
          ? role === 1
            ? "Approved"
            : "Waiting"
          : status,
    });

    if (literature) {
      const literatureResult = await Literature.findOne({
        where: {
          id: literature.id,
        },
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
            "userId",
            "id_user",
            "id_category",
            "createdAt",
            "updatedAt",
          ],
        },
      });
      res.send({
        message: `Literature successfully added`,
        data: {
          literature: literatureResult,
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

exports.updateLiterature = async (req, res) => {
  try {
    const { id } = req.params;
    const literature = await Literature.update(req.body, {
      where: {
        id,
      },
    });
    if (literature) {
      const literatureResult = await Literature.findOne({
        where: {
          id,
        },
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
      });
      res.send({
        message: `Literature with id ${id} has been successfully edited`,
        data: {
          books: literatureResult,
        },
      });
    } else {
      res.status(400).send({
        message: "Error while updating Literature",
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

exports.testUpload = async (req, res) => {
  const file = req.file.filename.split("/")[2];
  // console.log(req.file.filename.split("/")[2]);
  res.send({
    file,
  });
};

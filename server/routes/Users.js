const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({ username: username, password: hash });
  });

  res.json("auth done!");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ where: { username: username } });

  if (!user) {
    res.json({ error: "User Doesn't Exist" });
  } else {
    bcrypt.compare(password, user.password).then((match) => {
      if (!match) {
        res.json({ error: "Wrong Username And Password Combination" });
      } else {
        const accessToken = sign(
          { username: user.username, id: user.id },
          "impSec"
        );
        res.json({ token: accessToken, username: username, id: user.id });
      }
    });
  }
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.get("/basicinfo/:id", async (req, res) => {
  const id = req.params.id;
  const userInfo = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  res.json(userInfo);
});

router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPass, newPass } = req.body;
  const user = await Users.findOne({ where: { username: req.user.username } });
  bcrypt.compare(oldPass, user.password).then((match) => {
    if (!match) {
      res.json({ error: "Wrong old Password" });
    } else {
      bcrypt.hash(newPass, 10).then((hash) => {
        Users.update(
          { password: hash },
          { where: { username: req.user.username } }
        );
      });
    }
    res.json("password chaanged");
  });
});

module.exports = router;

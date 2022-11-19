const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
  const allPosts = await Posts.findAll({ include: [Likes] });
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });

  res.json({ allPosts: allPosts, likedPosts: likedPosts });
});

router.post("/", validateToken, async (req, res) => {
  const post = req.body;
  post.username = req.user.username;
  post.UserId = req.user.id;
  await Posts.create(post);

  res.json(post);
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id);
  res.json(post);
});

router.get("/byUserId/:userId", async (req, res) => {
  const userId = req.params.userId;
  const post = await Posts.findAll({
    where: { UserId: userId },
    include: [Likes],
  });
  res.json(post);
});

router.put("/title", validateToken, async (req, res) => {
  const { newTitle, id } = req.body;
  await Posts.update({ title: newTitle }, { where: { id: id } });
  res.json(newTitle);
});

router.put("/text", validateToken, async (req, res) => {
  const { newText, id } = req.body;
  await Posts.update({ postText: newText }, { where: { id: id } });
  res.json(newText);
});

router.delete("/:postId", async (req, res) => {
  const id = req.params.postId;
  await Posts.destroy({ where: { id: id } });
  res.json("Deleted!");
});

module.exports = router;

import express from "express";
import { getAllMovies, getMovieById, getMovieByAwards, getMoviesByLanguage, getMoviesByFresh, getUserComments, getUserByEmail } from "../data/movies.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
  const page = req.query.page ? parseInt(req.query.page) : 0;
  try {
    const movies = await getAllMovies(pageSize, page);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await getMovieById(req.params.id);
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/awards/winners", async (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
  const page = req.query.page ? parseInt(req.query.page) : 0;
  try {
    const movies = await getMovieByAwards(pageSize, page);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/language/:language", async (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
  const page = req.query.page ? parseInt(req.query.page) : 0;
  try {
    const movies = await getMoviesByLanguage(pageSize, page, req.params.language);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/tomatoes/fresh", async (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
  const page = req.query.page ? parseInt(req.query.page) : 0;
  try {
    const movies = await getMoviesByFresh(pageSize, page);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/user/comments/:id", async (req, res) => {
  try {
    const comments = await getUserComments(req.params.id);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/user/:email", async (req, res) => {
  try {
    const user = await getUserByEmail(req.params.email);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;

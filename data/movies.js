import getConnection from "./conn.js";
const DATABASE = "sample_mflix";
const MOVIES = "movies";
import { ObjectId } from "mongodb";

async function getAllMovies(pageSize, page) {
  const connectiondb = await getConnection();
  const movies = await connectiondb
    .db(DATABASE)
    .collection(MOVIES)
    .find({})
    .limit(pageSize)
    .skip(pageSize * page)
    .toArray();
  return movies;
}

async function getMovieById(id) {
  const connectiondb = await getConnection();
  let movie;
  try {
    movie = await connectiondb
      .db(DATABASE)
      .collection(MOVIES)
      .findOne({ _id: new ObjectId(id) });
  } catch (error) {
    throw new Error('Invalid ID format');
  }
  return movie;
}

async function getMovieByAwards(pageSize, page) {
  const connectiondb = await getConnection();
  const movies = await connectiondb
    .db(DATABASE)
    .collection(MOVIES)
    .find({ 'awards.wins': { $gt: 0 } })
    .project({ title: 1, poster: 1, plot: 1 }) // Selecciona solo los campos necesarios
    .limit(pageSize)
    .skip(pageSize * page)
    .toArray();
  return movies;
}

async function getMoviesByLanguage(pageSize, page, language) {
  console.log(language + " pitoooo")
  const connectiondb = await getConnection();
  const movies = await connectiondb
    .db(DATABASE)
    .collection(MOVIES)
    .find({ languages: { $in: [language] } })
    .limit(pageSize)
    .skip(pageSize * page)
    .toArray();
  return movies;
}

async function getMoviesByFresh(pageSize, page) {
  const connectiondb = await getConnection();
  const movies = await connectiondb
    .db(DATABASE)
    .collection(MOVIES)
    .find({})
    .sort({ 'tomatoes.fresh': -1 }) 
    .limit(pageSize)
    .skip(pageSize * page)
    .toArray();
  return movies;
}

async function getUserComments(userId) {
  const connectiondb = await getConnection();

  const userEmail = await findEmail(userId);
  console.log(userEmail)

  const userComments = await connectiondb
    .db(DATABASE)
    .collection("comments")
    .aggregate([
      {
        $match: { email: userEmail }
      },
      {
        $lookup: {
          from: "movies",
          localField: "movie_id",
          foreignField: "_id",
          as: "movieDetails"
        }
      },
      { $unwind: "$movieDetails" },
      {
        $project: {
          _id: 0,
          userId: userId,
          comment: "$text",
          movieTitle: "$movieDetails.title",
          moviePoster: "$movieDetails.poster"
        }
      }
    ])
    .toArray();

  return userComments;
}

async function findEmail(id) {
  const connectiondb = await getConnection();
  let user;
  try {
    user = await connectiondb
      .db(DATABASE)
      .collection("users")
      .findOne({ _id: new ObjectId(id) });
  } catch (error) {
    throw new Error('Invalid ID format');
  }
  return user.email;
}

async function getUserByEmail(email) {
  const connectiondb = await getConnection();
  let user;
  try {
    user = await connectiondb
      .db(DATABASE)
      .collection("users")
      .findOne({ email: email });
  } catch (error) {
    throw new Error('Invalid email format');
  }
  return user;
}

export { getAllMovies, getMovieById, getMovieByAwards, getMoviesByLanguage, getMoviesByFresh, getUserComments, getUserByEmail };

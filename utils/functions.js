const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require("../db");
const { getMessage, messages } = require("./constants");

function signToken(obj) {
  return jwt.sign(obj, config.JWTAuthSecretToken);
}

async function getSnapshot(collection, id) {
  return await db.collection(collection).doc(id).get();
}

function getResponse(res, statusCode, des, collection) {
  if (statusCode == 200) return res.status(statusCode).json({ data: des });
  if (!statusCode && !des) return res.json();
  if (!statusCode) return res.json(getMessage(des, collection));
  return res.status(statusCode).json(getMessage(des, collection));
}

async function setDoc(collection, id, value) {
  await db.collection(collection).doc(id).set(value);
}

function authenticateJWT(req, res, next) {
  const token = req?.headers?.authorization?.split(" ")[1];
  jwt.verify(token, config.JWTAuthSecretToken, (err, user) => {
    if (!user) return getResponse(res, 400, messages.error.auth.token);
    next();
  });
}
module.exports = {
  signToken,
  getSnapshot,
  getResponse,
  setDoc,
  authenticateJWT,
};

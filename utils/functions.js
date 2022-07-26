const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require("../db");
const { getMessage, messages } = require("./constants");
const { key } = require("firebase-key");

function generateToken() {
  return key();
}

function signToken(obj) {
  return jwt.sign(obj, config.JWTAuthSecretToken);
}

async function getSnapshot(collection, id) {
  return await db.collection(collection).doc(id).get();
}

function getResponse(res, statusCode, des, collection, resData) {
  if (statusCode == 200) return res.status(statusCode).json({ data: des });
  if (!statusCode && !des) return res.json();
  console.log(resData);
  if (!statusCode) return res.json(getMessage(des, collection, resData));

  return res.status(statusCode).json(getMessage(des, collection, resData));
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
  generateToken,
};

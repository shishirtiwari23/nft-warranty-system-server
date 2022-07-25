"use strict";

const dotenv = require("dotenv");
const assert = require("assert");

dotenv.config();

const {
  PORT,
  HOST,
  HOST_URL,
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MESUREMENT_ID,
  JWT_AUTH_SECRET_TOKEN,
} = process.env;

assert(PORT, "PORT is Required");
assert(HOST, "HOST is Required");

module.exports = {
  port: PORT,
  host: HOST,
  hostUrl: HOST_URL,

  firebaseConfig: {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
    measurementId: MESUREMENT_ID,
  },
  JWTAuthSecretToken: JWT_AUTH_SECRET_TOKEN,
};

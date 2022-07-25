"use strict";

const dotenv = require("dotenv");
// const assert = require("assert");

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

// assert(PORT, "PORT is Required");
// assert(HOST, "HOST is Required");

const firebaseConfig = {
  apiKey: "AIzaSyAk1zx-B4ixt9txFnPdXhGK4Lso2VIF24w",
  authDomain: "nft-warranty-system-server.firebaseapp.com",
  projectId: "nft-warranty-system-server",
  storageBucket: "nft-warranty-system-server.appspot.com",
  messagingSenderId: "285763757743",
  appId: "1:285763757743:web:2caf17007c65eacf63d65a",
  measurementId: "G-DCH0L38WC6",
};

module.exports = {
  port: PORT,
  host: HOST,
  hostUrl: HOST_URL,
  firebaseConfig,
  JWTAuthSecretToken: JWT_AUTH_SECRET_TOKEN,
};

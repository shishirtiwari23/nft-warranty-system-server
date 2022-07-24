const { User } = require("../models/User");
const { query } = require("firebase");
const db = require("../db");
const { getCollection } = require("./");
const { messages, getMessage, collections } = require("../utils/constants");

async function addUser(req, res, next) {
  try {
    const data = req.body;
    await db.firestore().collection(collections.USERS).doc().set(data);
  } catch (error) {
    res.status(400).json(getMessage(messages.error.default));
  }
}

async function getAllUsers(req, res, next) {
  try {
    const users_ref = await db.firestore().collection(collections.USERS);
    const users_snapshot = await users_ref.get();
    if (users_snapshot.empty) {
      res.status(200).json([]);
    } else {
      const users = users_snapshot.docs?.map((doc) => {
        doc = doc?.data();
        const user = new User(doc?.id, doc?.walletAddress, doc?.name);
        return user;
      });

      res.status(200).json(users);
    }
  } catch (error) {
    res.status(400).json(getMessage(messages.error.default));
  }
}

async function getUser(req, res, next) {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(404)
        .json(getMessage(messages.error.user.id.undefined, collections.USERS));
    const users_ref = await db.firestore().collection(collections.USERS);
    let users_snapshot = await users_ref.where("id", "==", id).get();
    if (!users_snapshot.exists) {
      return res
        .status(404)
        .json(getMessage(messages.error.user.notFound, collections.USERS));
    }
    const users = users_snapshot.docs.map((user) => {
      return user?.data();
    });
    res.status(200).json(users[0]);

    //why below message is not getting sent
  } catch (error) {
    res.status(500).json(error.message);
  }
}

async function updateUser(req, res, next) {
  try {
    const {
      body: data,
      params: { id },
    } = req;
    const user_snapshot = await db
      .firestore()
      .collection(collections.USERS)
      .where("id", "==", id)
      .get();
    await user_snapshot.update(data);
    res
      .status(400)
      .json(getMessage(messages.success.user.added, collections.USERS));
  } catch (error) {
    res
      .status(500)
      .json(getMessage(messages.error.user.added, collections.USERS));
  }
}

// async function getUserr(req, res, next) {
//   try {
//     const data = req.params;
//     const { id } = data;
//     // const users=getAllUsers(req,res,next) How to do this?
//     const user_ref = await db.firestore().collection(collections.USERS).doc(id);
//     const user_snapshot = await user_ref.get();
//     console.log(user_snapshot.data());
//     if (user_snapshot?.exists) res.status(200).json(user_snapshot.data());
//     else {
//       res
//         .status(404)
//         .json(getMessage(messages.error.user.notFound, collections.USERS));
//     }
//     // if (users_snapshot.empty) {
//     //   res.status(200).json([]);
//     // } else {
//     //   const users = users_snapshot.docs?.map((doc) => {
//     //     doc = doc?.data();
//     //     const user = new User(doc?.id, doc?.walletAddress, doc?.name);
//     //     return user;
//     //   });
//     //   const user = users.filter((user) => user.id == id);
//     //   res.status(200).json(user);
//     // }
//   } catch (error) {
//     res.status(400).json(getMessage(messages.error.default));
//   }
// }

module.exports = {
  addUser,
  getAllUsers,
  getUser,
  updateUser,
};

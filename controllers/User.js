const { User } = require("../models");
const { query } = require("firebase");
const {
  signToken,
  getResponse,
  getSnapshot,
  createDoc,
} = require("../utils/functions");
const db = require("../db");
const { messages, getMessage, collections } = require("../utils/constants");

async function addUser(req, res) {
  try {
    const { body } = req;
    if (!body)
      // body can't be empty
      return getResponse(res, 500, messages.error.user.add, collections.USERS);
    const { walletAddress, contractAddress } = body;

    if (!walletAddress)
      // body should contain both walletAddress and contractAddress
      return getResponse(
        res,
        500,
        messages.error.user.required,
        collections.USERS
      );
    const userSnapshot = await getSnapshot(collections.USERS, walletAddress);
    if (userSnapshot.exists)
      // checking if user already exists
      return getResponse(
        res,
        400,
        messages.error.user.exist,
        collections.USERS
      );

    const newUser = {
      walletAddress,
      tokens: [],
    };
    await createDoc(collections.USERS, walletAddress, newUser);
    getResponse(res, 200, messages.success.user.add, collections.USERS);
  } catch (error) {
    getResponse(res, 400, messages.error.user.add, collections.USERS);
  }
}

async function login(req, res) {
  try {
    const {
      body: { walletAddress },
    } = req;
    const userSnapshot = await getSnapshot(collections.USERS, walletAddress); // Why do i have to put an await here
    if (!userSnapshot.exists)
      return getResponse(
        res,
        404,
        messages.error.user.notFound,
        collections.USERS
      );
    getResponse(res, 200, {
      user: userSnapshot.data(),
      authToken: signToken({ walletAddress }),
    });
  } catch (error) {
    getResponse(res, 400, messages.error.user.get, collections.USERS);
  }
}

module.exports = {
  addUser,
  login,
};

// async function getUser(req, res) {
//   try {
//     const {
//       params: { walletAddress },
//     } = req;
//     const userSnapshot = await getSnapshot(collections.USERS, walletAddress); // Why do i have to put an await here
//     if (!userSnapshot.exists)
//       return getResponse(
//         res,
//         404,
//         messages.error.user.notFound,
//         collections.USERS
//       );
//     getResponse(res, 200, userSnapshot.data());
//   } catch (error) {
//     getResponse(res, 400, messages.error.user.get, collections.USERS);
//   }
// }

// async function addUser(req, res, next) {
//   try {
//     const data = req.body;
//     await db.firestore().collection(collections.USERS).doc().set(data);
//     res
//       .status(400)
//       .json(getMessage(messages.success.user.add, collections.USERS));
//   } catch (error) {
//     res
//       .status(400)
//       .json(getMessage(messages.error.user.add, collections.USERS));
//   }
// }

// async function getAllUsers(req, res, next) {
//   try {
//     const users_ref = await db.firestore().collection(collections.USERS);
//     const users_snapshot = await users_ref.get();
//     if (users_snapshot.empty) {
//       return res.status(200).json([]);
//     } else {
//       const users = users_snapshot.docs?.map((doc) => {
//         doc = doc?.data();
//         const user = new User(doc?.id, doc?.walletAddress, doc?.name);
//         return user;
//       });

//       res.status(200).json(users);
//     }
//   } catch (error) {
//     res.status(400).json(getMessage(messages.error.default));
//   }
// }

// async function getUser(req, res, next) {
//   try {
//     const { id } = req.params;
//     if (!id)
//       return res
//         .status(404)
//         .json(getMessage(messages.error.user.id.undefined, collections.USERS));
//     const users_ref = db.firestore().collection(collections.USERS);
//     let users_snapshot = await users_ref.where("id", "==", id).get();
//     if (users_snapshot.exists) {
//       //Ye nahi kaam karra hai
//       return res
//         .status(404)
//         .json(getMessage(messages.error.user.notFound, collections.USERS));
//     }
//     const users = users_snapshot.docs.map((user) => {
//       return user?.data();
//     });
//     console.log(users);
//     res.status(200).json(users);

//     //why below message is not getting sent
//   } catch (error) {
//     res.status(500).json(error.message);
//   }
// }

// async function updateUser(req, res, next) {
//   try {
//     const {
//       body: data,
//       params: { id },
//     } = req;
//     const user_docs_ref = await db
//       .firestore()
//       .collection(collections.USERS)
//       .where("id", "==", id)
//       .get();
//     user_docs_ref.forEach((doc) => {
//       doc.set(data);
//     });
//     // });
//     return res
//       .status(400)
//       .json(getMessage(messages.success.user.update, collections.USERS));
//   } catch (error) {
//     res
//       .status(500)
//       .json(getMessage(messages.error.user.update, collections.USERS));
//   }
// }

// async function updateUser(req, res, next) {
//   try {
//     const {
//       body: data,
//       params: { id },
//     } = req;
//     const user_snapshot = await db
//       .firestore()
//       .collection(collections.USERS)
//       .doc("6RCIANXpnSdDwnyKHnuF");
//     await user_snapshot.update(data);
//     console.log();
//     // const user_snapshot = db
//     //   .firestore()
//     //   .collection(collections.USERS)
//     //   .where("id", "==", id);
//     // user_snapshot.docs.map((doc) => console.log(doc.data()));
//     // console.log(id);
//     // await user_snapshot.map((docRef) => {
//     //   return docRef.update(data);
//     // });
//     return res
//       .status(400)
//       .json(getMessage(messages.success.user.update, collections.USERS));
//   } catch (error) {
//     res
//       .status(500)
//       .json(getMessage(messages.error.user.update, collections.USERS));
//   }
// }

const { User } = require("../models");
const { query } = require("firebase");
const {
  signToken,
  getResponse,
  getSnapshot,
  setDoc,
} = require("../utils/functions");
const db = require("../db");
const { messages, getMessage, collections } = require("../utils/constants");

async function addUser(req, res) {
  try {
    const { body } = req;
    if (!body)
      // body can't be empty
      return getResponse(res, 500, messages.error.user.add, collections.USERS);
    const { walletAddress } = body;

    if (!walletAddress)
      // body should contain both walletAddress and contractAddress
      return getResponse(res, 500, messages.error.required, collections.USERS);
    const userSnapshot = await getSnapshot(collections.USERS, walletAddress);

    if (userSnapshot.exists)
      // checking if user already exists
      return getResponse(
        res,
        200,
        messages.error.user.exist,
        collections.USERS
      );

    const newUser = {
      walletAddress,
      tokens: {},
    };
    await setDoc(collections.USERS, walletAddress, newUser);
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
    if (!walletAddress)
      return getResponse(res, 400, messages.error.required, collections.USERS);
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

async function addToken(req, res) {
  try {
    let duplicate = false;
    const { body } = req;
    if (!body)
      return getResponse(res, 400, messages.error.required, collections.USERS);
    const { URI, id, contractAddress, walletAddress, APIToken } = body;

    if (!URI || !id || !contractAddress || !walletAddress || !APIToken)
      return getResponse(res, 400, messages.error.required, collections.USERS);
    const APITokenSnapshot = await getSnapshot(collections.API_KEYS, APIToken);
    if (!APITokenSnapshot.exists)
      return getResponse(res, 400, messages.error.APIToken.invalid);
    const parentWalletAddress = APITokenSnapshot.data().walletAddress;
    const userSnapshot = await getSnapshot(collections.USERS, walletAddress);
    if (!userSnapshot.exists) {
      const newUserData = {
        walletAddress,
        tokens: {
          [parentWalletAddress]: [{ URI, id, contractAddress }],
        },
      };
      await setDoc(collections.USERS, walletAddress, newUserData);
      return getResponse(
        res,
        200,
        messages.success.token.add,
        collections.USERS
      );
    } else {
      const oldData = userSnapshot.data();
      const oldContractSpecificTokens =
        oldData.tokens[parentWalletAddress] || [];

      oldContractSpecificTokens?.forEach((token) => {
        if (token.id == id && token.contractAddress == contractAddress) {
          duplicate = true;
        }
      });
      if (duplicate)
        return getResponse(
          res,
          203,
          messages.error.token.exist,
          collections.USERS
        );

      const newTokens = {
        ...oldData.tokens,
        [parentWalletAddress]: [
          ...oldContractSpecificTokens,
          { id, URI, contractAddress },
        ],
      };

      const newUserData = {
        ...oldData,
        tokens: newTokens,
      };

      await setDoc(collections.USERS, walletAddress, newUserData);
      getResponse(res, 200, messages.success.token.add, collections.USERS);
    }
  } catch (error) {
    getResponse(res, 400, messages.error.token.add, collections.USERS);
  }
}

async function getUserCollections(req, res) {
  try {
    const { params } = req;
    if (!params)
      return getResponse(res, 203, messages.error.required, collections.USERS);
    const { walletAddress } = params;
    if (!walletAddress)
      return getResponse(res, 203, messages.error.required, collections.USERS);
    const userSnapshot = await getSnapshot(collections.USERS, walletAddress);
    if (!userSnapshot.exists)
      return getResponse(
        res,
        400,
        messages.error.user.exist,
        collections.USERS
      );
    // const clientsSnapshot=await db.collection(collections.PARENT_CLIENTS).docs
    const userCollections = Object.keys(userSnapshot.data().tokens) || [];
    const filteredClientsPromises = userCollections.map(
      async (clientWalletAddress) => {
        const clientSnapshot = await getSnapshot(
          collections.PARENT_CLIENTS,
          clientWalletAddress
        );
        return clientSnapshot.data();
      }
    );
    const filteredClients = await Promise.all(filteredClientsPromises);
    getResponse(
      res,
      203,
      messages.success.default,
      collections.USERS,
      filteredClients
    );
  } catch (error) {
    getResponse(res, 400, messages.error.default, collections.USERS);
  }
}

async function getUserTokensByClientId(req, res) {
  //To be precise here we'll get an wallet address of parent which we will be used for filtering from all the token a user own to only specific to a collection
  try {
    const { body } = req;
    if (!body)
      return getResponse(res, 203, messages.error.required, collections.USERS);
    const { parentWalletAddress, walletAddress } = body; //user walletAddress
    if (!parentWalletAddress || !walletAddress)
      return getResponse(res, 203, messages.error.required, collections.USERS);

    const userSnapshot = await getSnapshot(collections.USERS, walletAddress);
    if (!userSnapshot.exists)
      return getResponse(
        res,
        203,
        messages.error.user.exist,
        collections.USERS
      );
    const filteredTokenList = userSnapshot.data().tokens[parentWalletAddress];
    getResponse(
      res,
      210,
      messages.success.default,
      collections.USERS,
      filteredTokenList
    );
  } catch (error) {
    getResponse(res, 400, messages.error.default, collections.USERS);
  }
}

module.exports = {
  addUser,
  login,
  getUserTokensByClientId,
  addToken,
  getUserCollections,
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

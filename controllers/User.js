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
    if (!walletAddress) {
      // body should contain both walletAddress and contractAddress
      return getResponse(res, 500, messages.error.required, collections.USERS);
    }
    const userSnapshot = await getSnapshot(collections.USERS, walletAddress);

    if (userSnapshot.exists) {
      // checking if user already exists
      return getResponse(
        res,
        200,
        messages.error.user.exist,
        collections.USERS
      );
    }
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
    console.log(body);
    if (!walletAddress)
      return getResponse(res, 400, messages.error.required, collections.USERS);
    console.log({ walletAddress });
    const userSnapshot = await getSnapshot(collections.USERS, walletAddress); // Why do i have to put an await here
    if (!userSnapshot.exists) {
      console.log("user not found wala if");
      return getResponse(
        res,
        404,
        messages.error.user.notFound,
        collections.USERS
      );
    }
    console.log("response ke phel wala");
    getResponse(res, 210, messages.success.default, collections.USERS, {
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

async function transferOwnership(req, res) {
  try {
    const { body } = req;
    let duplicate = false;
    if (!body)
      return getResponse(res, 400, messages.error.required, collections.USERS);
    const {
      URI,
      id,
      contractAddress,
      receiverWalletAddress,
      clientWalletAddress,
      senderWalletAddress,
    } = body;
    if (
      !receiverWalletAddress ||
      !clientWalletAddress ||
      !URI ||
      !id ||
      !contractAddress ||
      !senderWalletAddress
    )
      return getResponse(res, 400, messages.error.required, collections.USERS);
    const senderSnapshot = await getSnapshot(
      collections.USERS,
      senderWalletAddress
    );
    const senderData = senderSnapshot.data();
    let clientSpecificTokens = senderData.tokens[clientWalletAddress];

    for (let i = 0; i < clientSpecificTokens.length; i++) {
      if (
        clientSpecificTokens[i].id == id &&
        clientSpecificTokens[i].contractAddress == contractAddress
      ) {
        clientSpecificTokens.splice(i, 1);
      }
    }
    const newSenderData = {
      ...senderData,
      tokens: {
        ...senderData.tokens,
        [clientWalletAddress]: clientSpecificTokens,
      },
    };
    await setDoc(collections.USERS, senderWalletAddress, newSenderData); //This is to remove the token from the sender's database

    const userSnapshot = await getSnapshot(
      collections.USERS,
      receiverWalletAddress
    );
    if (!userSnapshot.exists) {
      const newUserData = {
        walletAddress: receiverWalletAddress,
        tokens: {
          [clientWalletAddress]: [{ URI, id, contractAddress }],
        },
      };
      await setDoc(collections.USERS, receiverWalletAddress, newUserData);
      return getResponse(
        res,
        200,
        messages.success.token.add,
        collections.USERS
      );
    } else {
      const oldData = userSnapshot.data();
      const oldContractSpecificTokens =
        oldData.tokens[clientWalletAddress] || [];

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
        [clientWalletAddress]: [
          ...oldContractSpecificTokens,
          { id, URI, contractAddress },
        ],
      };

      const newUserData = {
        ...oldData,
        tokens: newTokens,
      };

      await setDoc(collections.USERS, receiverWalletAddress, newUserData);
      getResponse(res, 200, messages.success.token.add, collections.USERS);
    }
  } catch (error) {
    getResponse(res, 400, messages.error.token.add, collections.USERS);
  }
}

async function issueComplaint(req, res) {
  try {
    const { body } = req;
    if (!body)
      return getResponse(res, 203, messages.error.required, collections.USERS);
    const {
      description,
      tokenId,
      walletAddress,
      parentWalletAddress,
      complaintId,
      contractAddress,
    } = body;
    if (
      !description ||
      !tokenId ||
      !walletAddress ||
      !parentWalletAddress ||
      !complaintId ||
      !contractAddress
    )
      return getResponse(res, 203, messages.error.required, collections.USERS);

    //To store the complaint in parentClient
    const clientSnapshot = await getSnapshot(
      collections.PARENT_CLIENTS,
      parentWalletAddress
    );
    if (!clientSnapshot.exists)
      return getResponse(res, 210, messages.error.parentClient.notFound);

    const oldClientData = clientSnapshot.data();
    let oldIssues = oldClientData?.issues;
    if (!oldIssues) oldIssues = [];
    const newClientData = {
      ...oldClientData,
      issues: [
        ...oldIssues,
        {
          complaintId,
          contractAddress,
          tokenId,
          walletAddress,
          description,
          status: 0,
        },
      ],
    };

    await setDoc(
      collections.PARENT_CLIENTS,
      parentWalletAddress,
      newClientData
    );

    //To Store the complaint in user collection
    const userSnapshot = await getSnapshot(collections.USERS, walletAddress);
    if (!userSnapshot.exists)
      return getResponse(
        res,
        400,
        messages.error.user.exist,
        collections.USERS
      );
    const oldTokens = userSnapshot.data().tokens;

    let clientSpecificTokens = oldTokens[parentWalletAddress];
    for (let i = 0; i < clientSpecificTokens.length; i++) {
      if (
        clientSpecificTokens[i].id == tokenId &&
        clientSpecificTokens[i].contractAddress == contractAddress
      ) {
        clientSpecificTokens[i] = {
          ...clientSpecificTokens[i],
          issue: {
            status: 0,
            description,
            complaintId,
          },
        };
      }
    }
    const newUserData = {
      ...userSnapshot.data(),
      tokens: {
        ...oldTokens,
        [parentWalletAddress]: clientSpecificTokens,
      },
    };

    await setDoc(collections.USERS, walletAddress, newUserData);

    return getResponse(
      res,
      210,
      messages.success.default,
      collections.PARENT_CLIENTS
    );
  } catch (error) {
    return getResponse(res, 400, messages.error.default, collections.USERS);
  }
}

async function updateStatus(req, res) {
  try {
    const { body } = req;
    if (!body)
      return getResponse(res, 203, messages.error.required, collections.USERS);
    const { walletAddress, parentWalletAddress, complaintId, newStatus } = body;
    if (!walletAddress || !parentWalletAddress || !complaintId || !newStatus)
      return getResponse(res, 203, messages.error.required, collections.USERS);
    //To store the complaint in parentClient
    const clientSnapshot = await getSnapshot(
      collections.PARENT_CLIENTS,
      parentWalletAddress
    );
    if (!clientSnapshot.exists)
      return getResponse(res, 210, messages.error.parentClient.notFound);
    const oldClientData = clientSnapshot.data();
    let oldIssues = oldClientData?.issues;
    if (!oldIssues) oldIssues = [];
    for (let i = 0; i < oldIssues.length; i++) {
      if (oldIssues[i].complaintId == complaintId) {
        oldIssues[i] = {
          ...oldIssues[i],
          status: newStatus,
        };
      }
    }

    const newClientData = {
      ...oldClientData,
      issues: oldIssues,
    };

    await setDoc(
      collections.PARENT_CLIENTS,
      parentWalletAddress,
      newClientData
    );

    //To Store the complaint in user collection
    const userSnapshot = await getSnapshot(collections.USERS, walletAddress);
    if (!userSnapshot.exists)
      return getResponse(
        res,
        400,
        messages.error.user.exist,
        collections.USERS
      );
    const oldTokens = userSnapshot.data().tokens;

    let clientSpecificTokens = oldTokens[parentWalletAddress];
    for (let i = 0; i < clientSpecificTokens.length; i++) {
      if (clientSpecificTokens[i].issue.complaintId == complaintId) {
        clientSpecificTokens[i] = {
          ...clientSpecificTokens[i],
          issue: {
            ...clientSpecificTokens[i].issue,
            status: newStatus,
          },
        };
      }
    }
    const newUserData = {
      ...userSnapshot.data(),
      tokens: {
        ...oldTokens,
        [parentWalletAddress]: clientSpecificTokens,
      },
    };

    await setDoc(collections.USERS, walletAddress, newUserData);

    return getResponse(
      res,
      210,
      messages.success.default,
      collections.PARENT_CLIENTS
    );
  } catch (error) {
    return getResponse(res, 400, messages.error.default, collections.USERS);
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
  issueComplaint,
  transferOwnership,
  updateStatus,
};

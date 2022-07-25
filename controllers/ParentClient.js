const { messages, collections } = require("../utils/constants");
const {
  getResponse,
  setDoc,
  generateToken,
  getSnapshot,
} = require("../utils/functions");
const { ParentClient, Validity, Plan } = require("../models");

async function addParentClient(req, res) {
  try {
    const { body } = req;
    if (!body)
      return getResponse(
        res,
        400,
        messages.error.required,
        collections.PARENT_CLIENTS
      );
    const { walletAddress, contractAddress } = body;
    if (!walletAddress || !contractAddress)
      return getResponse(
        res,
        400,
        messages.error.required,
        collections.PARENT_CLIENTS
      );
    const clientSnapshot = await getSnapshot(
      collections.PARENT_CLIENTS,
      walletAddress
    );
    console.log(clientSnapshot.exists);
    if (clientSnapshot.exists)
      return getResponse(
        res,
        400,
        messages.error.parentClient.exist,
        collections.PARENT_CLIENTS
      );
    const newClient = {
      [ParentClient.APIToken]: generateToken(),
      [ParentClient.walletAddress]: walletAddress,
      [ParentClient.additionalUsers]: [],
      [ParentClient.contractAddress]: contractAddress,
      [ParentClient.validity]: {
        [Validity.from]: new Date(),
        [Validity.to]: new Date(),
      },
      [ParentClient.plan]: {
        [Plan.CPS]: 5,
        [Plan.APITokenLimit]: 10,
      },
      [ParentClient.children]: {},
    };
    await setDoc(collections.PARENT_CLIENTS, walletAddress, newClient);
    getResponse(
      res,
      200,
      messages.success.parentClient.add,
      collections.PARENT_CLIENTS
    );
  } catch (error) {
    getResponse(
      res,
      400,
      messages.error.parentClient.add,
      collections.PARENT_CLIENTS
    );
  }
}

async function getParentClient(req, res) {
  try {
    const { params } = req;
    if (!params)
      return getResponse(
        res,
        400,
        messages.error.required,
        collections.PARENT_CLIENTS
      );
    const { walletAddress } = params;
    if (!walletAddress)
      return getResponse(
        res,
        400,
        messages.error.required,
        collections.PARENT_CLIENTS
      );
    const clientSnapshot = await getSnapshot(
      collections.PARENT_CLIENTS,
      walletAddress
    );
    if (!clientSnapshot.exists)
      return getResponse(
        res,
        400,
        messages.error.parentClient.notFound,
        collections.PARENT_CLIENTS
      );
    getResponse(
      res,
      200,
      clientSnapshot.data(),
      messages.success.parentClient.exist
    );
  } catch (error) {
    getResponse(res, 400, messages.error.default, collections.PARENT_CLIENTS);
  }
}

module.exports = {
  addParentClient,
  getParentClient,
};

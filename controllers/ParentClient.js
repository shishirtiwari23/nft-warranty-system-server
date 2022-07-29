const { messages, collections } = require("../utils/constants");
const {
  getResponse,
  setDoc,
  generateToken,
  getSnapshot,
} = require("../utils/functions");
const { ParentClient, Validity, Plan } = require("../models");
const { key } = require("firebase-key");

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
    const { walletAddress, contractAddress, name } = body;
    if (!walletAddress || !contractAddress || !name)
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
    if (clientSnapshot.exists)
      return getResponse(
        res,
        400,
        messages.error.parentClient.exist,
        collections.PARENT_CLIENTS
      );
    const newClient = {
      [ParentClient.name]: name,
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
      [ParentClient.allContractAddresses]: [],
    };
    await setDoc(collections.PARENT_CLIENTS, walletAddress, newClient);
    await setDoc(collections.API_KEYS, newClient.APIToken, { walletAddress });

    getResponse(
      res,
      210,
      messages.success.parentClient.add,
      collections.PARENT_CLIENTS,
      newClient
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

async function getAllContractAddresses(req, res) {
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
    if (!clientSnapshot.exists) {
      return getResponse(
        res,
        400,
        messages.error.parentClient.exist,
        collections.PARENT_CLIENTS
      );
    }
    const clientData = clientSnapshot.data();
    getResponse(
      res,
      210,
      messages.success.default,
      collections.PARENT_CLIENTS,
      clientData.allContractAddresses
    );
  } catch (errror) {
    getResponse(res, 400, messages.error.default, collections.PARENT_CLIENTS);
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
        210,
        messages.error.parentClient.notFound,
        collections.PARENT_CLIENTS
      );
    getResponse(
      res,
      210,
      messages.success.parentClient.exist,
      collections.PARENT_CLIENTS,
      clientSnapshot.data()
    );
  } catch (error) {
    getResponse(res, 400, messages.error.default, collections.PARENT_CLIENTS);
  }
}

async function regenerateAPIToken(req, res) {
  try {
    const { body } = req;
    if (!body) return;
    const { walletAddress } = body;

    if (!walletAddress)
      return getResponse(
        res,
        406,
        messages.error.required,
        collections.PARENT_CLIENTS
      );

    const clientSnapshot = await getSnapshot(
      collections.PARENT_CLIENTS,
      walletAddress
    );
    if (!clientSnapshot.exists)
      return getResponse(res, 210, messages.error.parentClient.notFound);

    const clientData = clientSnapshot.data();
    const newClientData = {
      ...clientData,
      [ParentClient.APIToken]: generateToken(),
    };
    console.log(newClientData);

    await setDoc(collections.PARENT_CLIENTS, walletAddress, newClientData);
    getResponse(
      res,
      210,
      messages.success.parentClient.update,
      collections.PARENT_CLIENTS,
      newClientData
    );
  } catch (error) {
    getResponse(
      res,
      400,
      messages.error.parentClient.update,
      collections.PARENT_CLIENTS
    );
  }
}

async function getParentBySCID(req, res) {
  try {
    const { params } = req;
    if (!params)
      return getResponse(
        res,
        203,
        messages.error.required,
        collections.PARENT_CLIENTS
      );
    const { SCID } = params;
    if (!SCID)
      return getResponse(
        res,
        203,
        messages.error.required,
        collections.PARENT_CLIENTS
      );
  } catch (error) {
    getResponse(res, 400, messages.error.default, collections.PARENT_CLIENTS);
  }
}

module.exports = {
  addParentClient,
  getParentClient,
  regenerateAPIToken,
  getAllContractAddresses,
};

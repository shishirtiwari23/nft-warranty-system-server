const { messages, collections } = require("../utils/constants");
const { getResponse, getSnapshot, setDoc } = require("../utils/functions");

async function addChildClient(req, res) {
  try {
    const { body } = req;
    if (!body)
      return getResponse(
        res,
        400,
        messages.error.required,
        collections.PARENT_CLIENTS
      );

    const {
      walletAddress: parentWalletAddress,
      child: {
        id,
        walletAddress: childWalletAddress,
        contractAddress: childContractAddress,
      },
    } = body;
    console.log(
      parentWalletAddress,
      id,
      childWalletAddress,
      childContractAddress
    );
    if (
      !parentWalletAddress ||
      !id ||
      !childWalletAddress ||
      !childContractAddress
    )
      return getResponse(
        res,
        400,
        messages.error.required,
        collections.PARENT_CLIENTS
      );
    const parentSnapshot = await getSnapshot(
      collections.PARENT_CLIENTS,
      parentWalletAddress
    );

    if (!parentSnapshot.exists)
      return getResponse(
        res,
        400,
        messages.error.parentClient.notFound,
        collections.PARENT_CLIENTS
      );

    const oldChildren = parentSnapshot.data().children;
    if (oldChildren.hasOwnProperty(id))
      return getResponse(
        res,
        203,
        messages.error.childClient.exist,
        collections.PARENT_CLIENTS
      );

    const newChildren = {
      ...oldChildren,
      [id]: {
        id,
        walletAddress: childWalletAddress,
        contractAddress: childContractAddress,
        additionalUsers: [],
      },
    };
    const newParentDoc = {
      ...parentSnapshot.data(),
      children: newChildren,
    };
    setDoc(collections.PARENT_CLIENTS, parentWalletAddress, newParentDoc);
    getResponse(
      res,
      210,
      messages.success.childClient.add,
      collections.PARENT_CLIENTS,
      newChildren[id]
    );
  } catch (errror) {
    getResponse(
      res,
      400,
      messages.error.childClient.add,
      collections.PARENT_CLIENTS
    );
  }
}
async function getChildClient(req, res) {}
module.exports = {
  addChildClient,
  getChildClient,
};

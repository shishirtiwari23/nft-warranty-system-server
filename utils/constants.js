const messages = {
  error: {
    default: { message: "Some Error Occured" },
    user: {
      notFound: {
        message: "User not found",
      },
      id: {
        invalid: { message: "Invalid id" },
        undefined: { message: "id is undefined" },
      },
      added: {
        message: "Failed to add user",
      },
      update: {
        message: "Failed to update user",
      },
    },
    fetch: {
      ref: {
        message: "Unable To Fetch User Ref",
      },
      snapshot: {
        message: "Unable to fetch snapshot",
      },
    },
  },
  success: {
    default: {
      message: "Success",
    },
    user: {
      added: {
        message: "User added successfully",
      },
      updated: {
        message: "User updated successfully",
      },
    },
  },
};

function getMessage(obj, collectionName) {
  const newObj = {
    message:
      obj.message + (collectionName ? ", collection:" + collectionName : ""),
  };
  return newObj;
}

const collections = {
  USERS: "USERS",
};

module.exports = {
  messages,
  getMessage,
  collections,
};

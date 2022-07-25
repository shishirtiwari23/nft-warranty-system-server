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
      add: {
        message: "Unable to add user",
      },
      update: {
        message: "Unable to update user",
      },
      exist: {
        message: "User already exists",
      },

      get: {
        message: "Unable to get user",
      },
    },
    required: {
      message: "Required fields are not missing",
    },
    token: {
      add: {
        message: "Unable to Add token",
      },
      exist: {
        message: "Token already exists",
      },
    },
    auth: {
      token: {
        message: "Invalid Token",
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
      add: {
        message: "User added successfully",
      },
      update: {
        message: "User updated successfully",
      },
    },
    token: {
      add: {
        message: "Token added successfully",
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
  PARENT_CLIENTS: "PARENT_CLIENTS",
  CHILD_CLIENTS: "CHILD_CLIENTS",
};

module.exports = {
  messages,
  getMessage,
  collections,
};

const messages = {
  error: {
    default: { message: "Some Error Occured" },
    parentClient: {
      add: {
        message: "Unable to add ParentClient",
      },
      delete: {
        message: "Unable to delete ParentClient",
      },
      notFound: {
        message: "ParentClient not found",
      },
      exist: {
        message: "ParentClient already exists",
      },
      update: {
        message: "Unable to update ParentClient",
      },
    },
    childClient: {
      add: {
        message: "Unable to add ChildClient",
      },
      delete: {
        message: "Unable to delete ChildClient",
      },
      notFound: {
        message: "ChildClient not found",
      },
      exist: {
        message: "ChildClient already exists",
      },
      update: {
        message: "Unable to update ChildClient",
      },
    },
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
      message: "Required fields are missing",
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
      exist: {
        message: "User found",
      },
    },
    token: {
      add: {
        message: "Token added successfully",
      },
    },
    parentClient: {
      add: {
        message: "ParentClient added successfully",
      },
      delete: {
        message: "ParentClient deleted successfully",
      },
      exist: {
        message: "ParentClient found",
      },
      update: {
        message: "ParentClient updated successfully",
      },
    },
    childClient: {
      add: {
        message: "ChildClient added successfully",
      },
      delete: {
        message: "ChildClient deleted successfully",
      },
      exist: {
        message: "ChildClient found",
      },
      update: {
        message: "ChildClient updated successfully",
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

const ParentClient = {
  APIToken: "APIToken",
  walletAddress: "walletAddress",
  additionalUsers: "additionalUsers",
  contractAddress: "contractAddress",
  validity: {
    from: "from",
    to: "to",
  },
  plans: {
    basic: {
      CPS: "CPS",
      apiTokenLimit: "apiTokenLimit",
    },
    pro: {
      CPS: "CPS",
      apiTokenLimit: "apiTokenLimit",
    },
    premium: {
      CPS: "CPS",
      apiTokenLimit: "apiTokenLimit",
    },
  },
  children: "children",
};

module.exports = ParentClient;

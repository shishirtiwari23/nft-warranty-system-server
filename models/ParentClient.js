const ParentClient = {
  name: "name",
  APIToken: "APIToken",
  walletAddress: "walletAddress",
  additionalUsers: "additionalUsers",
  contractAddress: "contractAddress",
  validity: "validity", //Validity
  plan: "plan", //Plan
  children: "children",
  allContractAddresses: "allContractAddresses",
  issues: "issues",
};

const Validity = {
  from: "from",
  to: "to",
};

const Plan = {
  CPS: "CPS",
  APITokenLimit: "APITokenLimit",
};

module.exports = { ParentClient, Validity, Plan };

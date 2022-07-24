class User {
  constructor(id, walletAddress, name) {
    this.id = id;
    this.walletAddress = walletAddress;
    this.name = name;
  }
}

module.exports = {
  User,
};


class User {
    constructor(walletAdressess, sessionKey, payDate, publicKey, payState) {
      this.walletAdressess = walletAdressess;
      this.sessionKey = sessionKey;
      this.payDate = payDate;
      this.publicKey = publicKey;
      this.userState = payState;
    }
    // Static method to create a User instance from a JSON object
    static fromJson(json) {
        return new User(json.walletAdressess, json.sessionKey, json.payDate, json.publicKey, json.userState);
    }
  
}
module.exports = User
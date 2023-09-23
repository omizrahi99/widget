
class User {
    constructor(walletAdress, sessionKey, payDate, publicKey, payState) {
      this.walletAdress = walletAdress;
      this.sessionKey = sessionKey;
      this.payDate = payDate;
      this.publicKey = publicKey;
      this.userState = payState;
    }
    // Static method to create a User instance from a JSON object
    static fromJson(json) {
        return new User(json.walletAdress, json.sessionKey, json.payDate, json.publicKey, json.userState);
    }
  
}
module.exports = User
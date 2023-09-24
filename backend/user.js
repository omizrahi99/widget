
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
    static toJson() {
        return JSON.stringify({
            walletAdress: this.walletAdress,
            sessionKey: this.sessionKey,
            payDate: this.payDate,
            publicKey: this.publicKey,
            userState: this.userState
        });
    }

  
}
module.exports = User
/* eslint-disable linebreak-style */
class AuthErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = AuthErr;

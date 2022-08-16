/* eslint-disable linebreak-style */
class ConflictReqErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = ConflictReqErr;

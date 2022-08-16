/* eslint-disable linebreak-style */
class BadReqErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = BadReqErr;

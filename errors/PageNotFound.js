/* eslint-disable linebreak-style */
class PageNotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = PageNotFound;

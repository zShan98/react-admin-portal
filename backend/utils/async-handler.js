module.exports.asyncHandler = (callback) => (req, res, next) =>
  Promise.resolve(callback(req, res, next)).catch(next);

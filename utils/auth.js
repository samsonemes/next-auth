const authenticated = fn => async (req, res) => {
    try {
      return await fn(req, res);

    } catch (err) {
      console.log(err.stack)
    }
  }

module.exports = authenticated;
  
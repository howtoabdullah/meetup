const mongoose = require('mongoose');

module.exports.connect = async (dsn) => {
  mongoose.connect(dsn, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
  });
};

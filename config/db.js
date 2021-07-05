const mongoose = require('mongoose');

const url = process.env.LOCAL_DB;
//database connection
const connectDB = async function () {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log('database connected successfully');
  } catch (err) {
    console.log(err);
  }
};

module.exports = { url, connectDB };

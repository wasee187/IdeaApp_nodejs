const mongoose = require('mongoose');

let url;
if (process.env.NODE_ENV === 'development') {
  url = process.env.LOCAL_DB;
} else if (process.env.NODE_ENV === 'production') {
  url = process.env.CLOUD_DB;
}
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

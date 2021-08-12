const prodMailConfig = {
  service: 'gmail',
  auth: {
    user: 'waseetech94@gmail.com',
    pass: 'w@see420',
  },
};

const devMailConfig = {
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'aiden.rosenbaum2@ethereal.email',
    pass: 'nUEGECHamjX5ASwdFu',
  },
};

module.exports = { devMailConfig, prodMailConfig };

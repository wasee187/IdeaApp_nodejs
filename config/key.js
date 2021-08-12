const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

const accountActivationSecret = process.env.ACCOUNT_ACTIVATION_SECRET_KEY;
const resetPasskey = process.env.RESET_PASS_SECRET_KEY;

let senderEmail;
let host;
if (process.env.NODE_ENV === 'development') {
  senderEmail = process.env.SENDER_EMAIL_DEV;
  host = process.env.HOST_ADDRESS_DEV;
} else if (process.env.NODE_ENV === 'production') {
  senderEmail = process.env.SENDER_EMAIL_PROD;
  host = process.env.HOST_ADDRESS_PROD;
}

module.exports = {
  clientID,
  clientSecret,
  senderEmail,
  accountActivationSecret,
  host,
  resetPasskey,
};

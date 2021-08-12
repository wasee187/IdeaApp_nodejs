const { senderEmail, host } = require('../config/key');

const welcomeEmail = (to, token) => {
  return {
    from: senderEmail,
    to,
    subject: 'Account Activation',
    text: `Greetings. Welcome from IdeaApp. Please <a href='${host}/auth/activate/${token}'>click here</a> to activate your account. Regards, IdeaApp team.`,
    html: `<h3>Greetings.</h3> <p>Welcome from IdeaApp. Please <a href="${host}/auth/activate/${token}">click here</a> to activate your account.</p> <p>Regards, IdeaApp team.</p>`,
  };
};

const farewellEmail = (to) => {
  return {
    from: senderEmail,
    to,
    subject: 'Account Delete Successful',
    text: 'Greetings. Your account is deleted successfully. Hope your journey with us was great. Thankyou for being with us. Regards, IdeaApp team.',
    html: '<h3>Greetings.</h3> <p> Your account is deleted successfully. Hope your journey with us was great.</p> <p>Thankyou for being with us.</p> <p> Regards, IdeaApp team.</p>',
  };
};

const passwordResetMail = (to, token) => {
  return {
    from: senderEmail,
    to,
    subject: 'Reset Password',
    text: `Greetings. Please <a href='${host}/auth/reset-password/${token}'>click here</a> to reset your password. Regards, IdeaApp team.`,
    html: `<h3>Greetings.</h3> <p>Please <a href="${host}/auth/reset-password/${token}">click here</a> to reset your password.</p> <p>Regards, IdeaApp team.</p>`,
  };
};
module.exports = { welcomeEmail, farewellEmail, passwordResetMail };

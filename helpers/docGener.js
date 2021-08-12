//function for getting idea

const generateIdeaDoc = ({
  _id,
  title,
  description,
  allowComments,
  categories,
  status,
  tags,
  user,
  createdAt,
  comments,
  image,
}) => {
  return {
    _id,
    title,
    description,
    allowComments,
    categories,
    status,
    tags,
    user,
    createdAt,
    comments,
    image,
  };
};

const generateCommentDoc = ({ _id, title, text, user, createdAt }) => {
  return {
    _id,
    title,
    text,
    user,
    createdAt,
  };
};

const generateUserDoc = ({
  _id,
  firstName,
  lastName,
  email,
  image,
  imageURL,
}) => {
  return {
    _id,
    firstName,
    lastName,
    email,
    image,
    imageURL,
  };
};

const generateCategoryDoc = ({ _id, categoryName }) => {
  return {
    _id,
    categoryName,
  };
};

module.exports = {
  generateIdeaDoc,
  generateCommentDoc,
  generateUserDoc,
  generateCategoryDoc,
};

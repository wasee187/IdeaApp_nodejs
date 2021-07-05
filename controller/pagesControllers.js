//home page controller
const homePageController = (req, res) => {
  res.render('pages/index', {
    text: 'Share Idea for better future',
    title: 'Home page',
  });
};

//about page controller

const aboutPageController = (req, res) => {
  res.render('pages/about', {
    title: 'About Us',
    head: 'About us',
    path: '/about',
  });
};

///not found page controller
const notFoundPageController = (req, res) => {
  res.status(404).render('pages/notFound', {
    title: 'Not Found',
  });
};
module.exports = {
  homePageController,
  aboutPageController,
  notFoundPageController,
};

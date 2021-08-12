const { validationResult } = require('express-validator');
const _ = require('lodash');

//requiring category model
const Category = require('../models/category');

const addIdeaValidator = async (req, res, next) => {
  try {
    const allowComments = req.body.allowComments ? true : false;
    req.body.allowComments = allowComments;
    const errors = validationResult(req);
    console.log(req.body);
    //getting all category
    const allCategories = await Category.find();

    if (!errors.isEmpty()) {
      const ideaCategoryList = [];

      if (req.body.categories) {
        // checking if req.body.categories is array or not//for array
        if (Array.isArray(req.body.categories)) {
          req.body.categories.filter((category) => {
            allCategories.map(({ categoryName }) => {
              if (categoryName === category) {
                ideaCategoryList.push({
                  category,
                  categoryName,
                });
              }
            });
          });

          //adding other category which are not included in ideaCategory list
          allCategories.map((category, i) => {
            if (
              category.categoryName !==
              (ideaCategoryList[i] ? ideaCategoryList[i].category : '')
            ) {
              ideaCategoryList.push({
                category: category.categoryName,
                categoryName: null,
              });
            }
          });
          //removing duplicate category with lodash in ideaCategoryList
          const uniqCategories = _.uniqBy(ideaCategoryList, 'category');

          req.body.categories = uniqCategories;
        } else {
          //for not array
          allCategories.map(({ categoryName }) => {
            //checking which category is matched with allCategories
            if (categoryName === req.body.categories) {
              ideaCategoryList.push({
                category: req.body.categories,
                categoryName,
              });
            }
          });

          //adding other category which are not included in ideaCategory list
          allCategories.map((category, i) => {
            if (
              category.categoryName !==
              (ideaCategoryList[i] ? ideaCategoryList[i].category : '')
            ) {
              ideaCategoryList.push({
                category: category.categoryName,
                categoryName: null,
              });
            }
          });

          //removing duplicate category with lodash in ideaCategoryList
          const uniqCategories = _.uniqBy(ideaCategoryList, 'category');

          req.body.categories = uniqCategories;
        }
      } else {
        allCategories.map(({ categoryName }) => {
          ideaCategoryList.push({
            category: categoryName,
            categoryName: null,
          });
        });

        req.body.categories = ideaCategoryList;
      }

      res.render('ideas/new', {
        title: 'Add Idea',
        path: '/ideas/new',
        errMsg: errors.array()[0].msg,
        idea: {
          title: req.body.title,
          description: req.body.description,
          allowComments,
          status: req.body.status,
          tags: req.body.tags,
          category: req.body.categories,
        },
      });
    } else {
      next();
    }
  } catch (err) {
    res.render('pages/error', {
      title: 'Error',
    });
  }
};

module.exports = addIdeaValidator;

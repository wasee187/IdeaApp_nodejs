const { validationResult } = require('express-validator');
//requiring category model
const Category = require('../models/category');
const _ = require('lodash');

const updateIdeaValidator = async (req, res, next) => {
  const allowComments = req.body.allowComments ? true : false;
  req.body.allowComments = allowComments;
  const errors = validationResult(req);
  const id = req.params.id;

  //getting all category
  const allCategories = await Category.find();

  if (!errors.isEmpty()) {
    const ideaCategoryList = [];

    //check if req.body have categories or not
    if (req.body.categories) {
      //check if req.body.categories is an Array or not
      if (Array.isArray(req.body.categories)) {
        //checking matched categories with req.body
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

    return res.render('ideas/edit', {
      title: 'Edit Idea',
      errMsg: errors.array()[0].msg,
      idea: {
        id,
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
};

module.exports = updateIdeaValidator;

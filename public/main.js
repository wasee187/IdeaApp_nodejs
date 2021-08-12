const categoryForm = document.querySelector('#categoryForm');
const categoryInput = document.querySelector('#categories');
const catMsg = document.querySelector('#catMsg');

const allCat = document.querySelector('.allCat');
const CategoryToShow = document.querySelector('.catTD');
const deleteCat = document.querySelector('.allCatToShow');
const likeCom = document.querySelector('.likeCom');
const likeCount = document.querySelector('.like-count');
const comCount = document.querySelector('.comment-count');

// Read the CSRF token from the <meta> tag
let token = document
  .querySelector('meta[name="csrf-token"]')
  .getAttribute('content');

//showing message
function showMessage(info) {
  if (info.success) {
    catMsg.innerHTML = `
      <div class="alert alert-success">
        ${info.message}
      </div>
    `;
  } else {
    catMsg.innerHTML = `
    <div class="alert alert-danger">
      ${info.message}
    </div>
  `;
  }
}
//show like count
function showLikeCount({ count }) {
  likeCount.innerHTML = count;
}
//show comment count
function showCommentCount({ count }) {
  comCount.innerHTML = count;
}
//showing all categories in category hbs
function showCategory(allCategories) {
  const result = allCategories.map(
    ({ categoryName }) => ` 
        <tr>
          <td>${categoryName}</td>
          <td data-name='${categoryName}'><i class="btn fas fa-trash-alt"></i></button></td>
          </tr>`
  );
  if (CategoryToShow) {
    CategoryToShow.innerHTML = result.join('   ');
  }
}

//adding category value to database
async function addCategory(data) {
  try {
    const response = await fetch('/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': token,
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (err) {
    console.log(err);
  }
}

//deleting category
async function deleteCategory(catName) {
  try {
    const response = await fetch(`/categories/${catName}`, {
      headers: {
        'CSRF-Token': token,
      },
      method: 'DELETE',
    });

    return await response.json();
  } catch (err) {
    console.log(err);
  }
}
//function for get categories
async function getCategories() {
  try {
    const response = await fetch('/categories');
    return response.json();
  } catch (err) {
    console.log(err);
  }
}
//function for get like
async function addLikes(id, userId) {
  try {
    const response = await fetch('/likes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': token,
      },
      body: JSON.stringify({
        id,
        userId,
      }),
    });
    return await response.json();
  } catch (err) {
    showMessage({
      success: false,
      message: 'Some error occurred in the server',
    });
  }
}
//get likes count function
async function getLikesCount(id) {
  try {
    const response = await fetch(`/likes/${id}`);
    return await response.json();
  } catch (err) {
    showMessage({
      success: false,
      message: 'Some error occurred in the server',
    });
  }
}

//get comment count
async function getCommentCount(id) {
  try {
    const response = await fetch(`/ideas/${id}/comments/count`);
    return await response.json();
  } catch (err) {
    showMessage({
      success: false,
      message: 'Some error occurred in the server',
    });
  }
}
//*******************Event listener*************************//

//event listener for category form submit
if (categoryForm) {
  categoryForm.addEventListener('submit', async (e) => {
    //prevent loading page
    e.preventDefault();
    const catName = categoryInput.value;
    //clearing input value
    categoryInput.value = ' ';
    try {
      //add a category
      const result = await addCategory({ categoryName: catName });

      if (result.success) {
        showMessage(result);
        //get all categories
        const catsResult = await getCategories();

        if (catsResult.success) {
          showCategory(catsResult.categories);
        }
      } else {
        showMessage(result);

        //get all categories
        const catsResult = await getCategories();
        if (catsResult.success) {
          showCategory(catsResult.categories);
        }
      }
    } catch (err) {
      showMessage({
        success: false,
        message: 'Some error occurred in the server',
      });
    }
  });
}

//event listener for deleting category
if (deleteCat) {
  deleteCat.addEventListener('click', async (e) => {
    e.preventDefault();
    if (e.target.classList.contains('fas')) {
      const catName = e.target.parentElement.dataset.name;

      try {
        const result = await deleteCategory(catName);

        if (result.success) {
          showMessage(result);

          //get all categories
          const catsResult = await getCategories();
          if (catsResult.success) {
            showCategory(catsResult.categories);
          }
        } else {
          showMessage(result);
          //get all categories
          const catsResult = await getCategories();
          if (catsResult.success) {
            showCategory(catsResult.categories);
          }
        }
      } catch (err) {
        showMessage({
          success: false,
          message: 'Some error occurred in the server',
        });
      }
    }
  });
}

//event listener for like
if (likeCom) {
  likeCom.addEventListener('click', async (e) => {
    //preventing reload
    e.preventDefault();
    if (e.target.classList.contains('far')) {
      const ideaId = e.target.parentElement.dataset.name;
      const userId = e.target.parentElement.dataset.id;

      if (!userId) {
        showMessage({
          success: false,
          message: `Please <a href="/auth/login">Login</a> to like the idea`,
        });
        return;
      }
      try {
        const result = await addLikes(ideaId, userId);
        //showing message
        showMessage(result);
        const countResult = await getLikesCount(ideaId);

        if (countResult.success) {
          showLikeCount(countResult);
        } else {
          showMessage(countResult);
        }
      } catch (err) {
        showMessage({
          success: false,
          message: 'Some error occurred in the server',
        });
      }
    }
  });
}
async function run() {
  try {
    if (CategoryToShow) {
      const catsResult = await getCategories();
      if (catsResult.success) {
        showCategory(catsResult.categories);
      }
    }
    //getting likes count
    if (likeCount) {
      const ideaId = likeCount.dataset.name;

      const likeCountResult = await getLikesCount(ideaId);
      if (likeCountResult.success) {
        showLikeCount(likeCountResult);
      } else {
        showMessage(likeCountResult);
      }
    }

    if (comCount) {
      const ideaId = comCount.dataset.name;
      const comCountResult = await getCommentCount(ideaId);
      if (comCountResult.success) {
        showCommentCount(comCountResult);
      } else {
        showMessage(comCountResult);
      }
    }
  } catch (err) {
    showMessage({
      success: false,
      message: 'Some error occurred in the server',
    });
  }
}

run();

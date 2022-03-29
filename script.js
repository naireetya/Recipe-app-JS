const mobileContainer = document.querySelector('.mobile-container');
// const favBtn = document.querySelector('.fav-btn');
const meals = document.querySelector('.meals');
const searchMeals = document.querySelector('.search-meals');
const favMeals = document.querySelector('.fav-meals');
const favMealsItems = document.querySelectorAll('.fav-meals > li');
const favContainer = document.querySelector('.fav-container');
const searchBtn = document.querySelector('.search');
const searchText = document.querySelector('.search-text');
const errorMssg = document.querySelector('.error');
const mealPopupContainer = document.querySelector('.popup-container');
const mealInfoEl = document.querySelector('.meal-info');
const closePopupBtn = document.querySelector('.close-popup');
// const meal = document.querySelector('.meal');

getRandomMeal();
topMeals();

async function getRandomMeal() {
  const response = await fetch(
    'https://www.themealdb.com/api/json/v1/1/random.php'
  );
  const responseData = await response.json();
  const randomMeal = responseData.meals[0];
  console.log(randomMeal);
  //   const meal = document.createElement('div');
  //   meal.classList.add('meal');
  html = `
  
  
  <div class="meal">
      <div class="meal-header">
        <span class="random"> Random Recipe </span>
        <img
          src="${randomMeal.strMealThumb}"
          alt=""
        />
      </div>
      <div class="meal-body">
        <h4>${randomMeal.strMeal}</h4>
      </div>
      </div>
    
      
    
    
    `;
  meals.insertAdjacentHTML('beforeend', html);
  meals.addEventListener('click', function (e) {
    showMealInfo(randomMeal);
  });
  //   meal
  //     .querySelector('.meal-body .fav-btn')
  //     .addEventListener('click', function (e) {
  //       alert('Hello');
  //     });
}
// favBtn.addEventListener('click', function (e) {
//   e.preventDefault();
//   console.log('Btn clicked');
// });

async function getMealById(id) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const meal = await response.json();
  console.log(meal.meals[0]);
  showMealInfo(meal.meals[0]);
}

async function topMeals() {
  let topMealsData = [];
  for (let i = 0; i < 3; i++) {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/random.php`
    );
    const responseData = await response.json();
    const meals = responseData.meals[0];
    topMealsData[i] = meals;
    console.log(meals);
    const html = `
    
    <li 
    class="meal-items"
    data-id="${meals.idMeal}">
    <img src="${meals.strMealThumb}" alt="${meals.strMeal}"
    /><span>${meals.strMeal}</span>
    </li>
    `;
    favMeals.insertAdjacentHTML('beforeend', html);
  }
  // console.log(topMealsData);

  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  // problem is that not able to attach addEventListener/pass to shoMealInfo to the all element in the array
  console.log(topMealsData);
}

$(document).on('click', '.meal-items, .search-meal', function () {
  let mealId = $(this).data('id');
  getMealById(mealId);
});

// document.addEventListener('click', function (e) {
//   if (e.target && e.target.classList.contains('fav-meals')) {
//     let elm = e.target;
//     console.log(elm);
//   }
// });

// favMealsItems.addEventListener('click', function (e) {
//   let mealId = this.getAttribute('data-id');
//   console.log('mealId', mealId);
//   // showMealInfo(topMealsData);
// });

async function getMealBySearch(term) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  const responseData = await response.json();
  const searchedMeal = responseData.meals;
  return searchedMeal;
  // //   console.log(searchedMeal);
}

searchBtn.addEventListener('click', async function (e) {
  searchMeals.textContent = '';
  e.preventDefault();
  //   console.log(searchText.value);
  const searchTerm = searchText.value;
  // console.log(await getMealBySearch(searchTerm));
  const resultData = await getMealBySearch(searchTerm);
  // console.log(resultData);

  if (resultData) {
    errorMssg.style.opacity = 0;
    searchText.value = '';
    searchText.blur();
    // favContainer.style.opacity = 0;
    // meals.style.opacity = 0;
    // favContainer.remove();
    meals.remove();
    resultData.forEach(meal => {
      const html = `
      
      <div 
      data-id="${meal.idMeal}"
      class="search-meal">
      <div class="search-meal-header">
        <img
          src="${meal.strMealThumb}"
          alt=""
        />
      </div>
      <div class="search-meal-body">
        <h4>${meal.strMeal}</h4>
      </div>
    </div>
    
      `;
      searchMeals.insertAdjacentHTML('beforeend', html);
    });
  } else {
    errorMssg.textContent = `Cannot find ${searchTerm}`;
    errorMssg.style.opacity = 1;
    // const html = `<h5 class="error">Cannot find ${term}</h5>`;
    // mobileContainer.insertAdjacentHTML('beforeend', html);
  }
  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  // problem is that not able to attach addEventListener/pass to all element that comes by searching
  searchMeals.addEventListener('click', function (e) {
    // console.log(e.target.resultData);
    // console.log(e.searchMeals);
    showMealInfo(resultData);
  });
});

function showMealInfo(mealData) {
  // data is coming in the form of array now we have to destructure array into object
  // console.log(mealData);
  // console.log(Array.isArray(mealData));
  if (Array.isArray(mealData)) {
    const [resultMealData] = mealData;
    // console.log(resultMealData);
    showPopup(resultMealData);
  } else {
    const resultMealData = mealData;
    showPopup(resultMealData);
  }
  // console.log(resultMealData);
}
function showPopup(mealData) {
  mealInfoEl.textContent = '';

  const html = `
    <h1>${mealData.strMeal}</h1>
    <img
      src="${mealData.strMealThumb}"
      alt=""
    />
    <p>
      ${mealData.strInstructions}
    </p>
    

    `;
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (mealData['strIngredient' + i]) {
      ingredients.push(
        `${mealData['strIngredient' + i]} / ${mealData['strMeasure' + i]}`
      );
    } else {
      break;
    }
  }
  mealInfoEl.insertAdjacentHTML('beforeend', html);
  mealPopupContainer.classList.remove('hidden');
  for (let i = 0; i < ingredients.length; i++) {
    const ulTag = `
    <ul>
    <li>${ingredients[i]}</li>
  </ul>
  `;
    mealInfoEl.insertAdjacentHTML('beforeend', ulTag);
  }
}

closePopupBtn.addEventListener('click', function (e) {
  mealPopupContainer.classList.add('hidden');
});

// meals.addEventListener('click', function (e) {
//   console.log(e.target);
// });

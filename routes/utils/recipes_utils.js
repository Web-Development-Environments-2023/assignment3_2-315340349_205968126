const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */
async function getRecipeInformation(recipe_id) {
  return await axios.get(`${api_domain}/${recipe_id}/information?`, {
    params: {
      includeNutrition: false,
      apiKey: process.env.spooncular_apiKey
    }
  });
}

/**
 * Get recipe ingredients from spooncular response and extract the relevant recipe data
 * @param {*} recipe_id 
 * @returns list of ingredients with amount and unit
 */
async function getRecipeIngredients(recipe_id) {
  // get ingredients info from spooncular
  let ingredients_info = await axios.get(`${api_domain}/${recipe_id}/ingredientWidget.json?`, {
    params: {
      apiKey: process.env.spooncular_apiKey
    }
  });
  // extract relevant data from spooncular response
  let ingredients_list = [];
  for (let ingredient of ingredients_info.data.ingredients) {
    let name = ingredient.name;
    let metricUnit = ingredient.amount.metric.unit;
    let metricValue = ingredient.amount.metric.value;
    // create object with relevant data
    let ingredientPair = {
      ingredient: name,
      amount: {
        metric: {
          unit: metricUnit,
          value: metricValue
        }
      }
    };
    
    ingredients_list.push(ingredientPair);
  }

  return ingredients_list;
}

/**
 * Get recipe steps from spooncular response and extract the relevant recipe data
 * @param {*} recipe_id 
 * @returns list of steps with step number and instruction
 */
async function getRecipeStep(recipe_id) {
  // get steps info from spooncular
  let recipe_steps = await axios.get(`${api_domain}/${recipe_id}/analyzedInstructions?`, {
    params: {
      apiKey: process.env.spooncular_apiKey
    }
  });
  //  extract relevant data from spooncular response
  let steps_list = [];
  let steps = recipe_steps.data[0].steps;
  for (let step of steps) {
    let stepNumber = step.number;
    let instruction = step.step;
    // create object with relevant data
    let stepPair = {
      stepNumber,
      instruction
    };
    
    steps_list.push(stepPair);
  }

  return steps_list;
}

/**
 * Get full recipe data from spooncular response and extract the relevant recipe data
 * @param {*} recipe_id 
 * @returns full recipe data
 */
async function getRecipeFullData(recipe_id) {
  // get recipe info, ingredients and steps from spooncular
  let recipeInfo = await getRecipeInformation(recipe_id);
  let ingredients = await getRecipeIngredients(recipe_id);
  let steps = await getRecipeStep(recipe_id);
  // create object with relevant data
  let fullData = {
    recipeInfo: await getRecipePreviewData(recipeInfo.data),
    ingredients,
    steps
  };

  return fullData;
}

// get recipe preview data from spooncular response
/**
 * 
 * @param {*} recipe_data 
 * @returns recipe object with relevant data
 */
async function getRecipePreviewData(recipe_data) {
  // extract relevant data from spooncular response
  let { id, title, readyInMinutes, image, aggregateLikes, vegan, glutenFree, servings } = recipe_data;
  
  return {
    id: id,
    title: title,
    readyInMinutes: readyInMinutes,
    image: image,
    popularity: aggregateLikes,
    vegan: vegan,
    glutenFree: glutenFree,
    servings: servings
  }
}

/**
 * Get recipe details by id
 * @param {*} recipe_id 
 * @returns recipe object with relevant data
 */
async function getRecipeDetails(recipe_id) {
  // get recipe info from spooncular
  let recipe_info = await getRecipeInformation(recipe_id);
  return await getRecipePreviewData(recipe_info.data);
}

/**
 * Get 3 random recipes from spooncular response and extract the relevant recipe data
 * @returns list of 3 random recipes with relevant data
 */
async function getRandomRecipe() {
  // get 3 random recipes from spooncular
  let random_recipes = await axios.get(`${api_domain}/random?number=3`, {
    params: {
      apiKey: process.env.spooncular_apiKey
    }
  });
  // extract relevant data from spooncular response
  let random_recipes_info = [];
  for (let recipe of random_recipes.data.recipes) {
    random_recipes_info.push(await getRecipePreviewData(recipe));
  }

  return random_recipes_info;
}

/**
 * Search for recipes by filters and query
 * @param {*} filters 
 * @returns recipes list with relevant data
 */
async function searchRecipes(filters) {
  const startTime = new Date().getTime(); // Start time in milliseconds
  // get recipes from spooncular
    const recipes = await axios.get(`${api_domain}/complexSearch`, {
      params: {
        instructionsRequired: true,
        apiKey: process.env.spooncular_apiKey,
        query: filters.query,
        cuisine: filters.cuisine,
        diet: filters.diet,
        intolerances: filters.intolerance,
        number: filters.numOfRecipes,
      }
    });
    const recipeIds = recipes.data.results.map(recipe => recipe.id).join(',');
    // get recipes info from spooncular
    const response = await axios.get(`${api_domain}/informationBulk`, {
      params: {
        apiKey: process.env.spooncular_apiKey,
        ids: recipeIds,
      }
    });
    const search_recipes = await Promise.all(response.data.map(recipe => getRecipePreviewData(recipe)));
    return search_recipes
}



exports.getRecipeFullData = getRecipeFullData;
exports.searchRecipes = searchRecipes;
exports.getRandomRecipe = getRandomRecipe;
exports.getRecipeDetails = getRecipeDetails;




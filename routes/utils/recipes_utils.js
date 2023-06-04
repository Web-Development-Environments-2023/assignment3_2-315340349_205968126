const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */

// get recipe information from spooncular response
async function getRecipeInformation(recipe_id) {
  return await axios.get(`${api_domain}/${recipe_id}/information?`, {
    params: {
      includeNutrition: false,
      apiKey: process.env.spooncular_apiKey
    }
  });
}

// get recipe ingredients from spooncular response
async function getRecipeIngredients(recipe_id) {
  let ingredients_info = await axios.get(`${api_domain}/${recipe_id}/ingredientWidget.json?`, {
    params: {
      apiKey: process.env.spooncular_apiKey
    }
  });

  let ingredients_list = [];
  for (let ingredient of ingredients_info.data.ingredients) {
    let name = ingredient.name;
    let metricUnit = ingredient.amount.metric.unit;
    let metricValue = ingredient.amount.metric.value;

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

// get recipe steps from spooncular response
async function getRecipeStep(recipe_id) {
  let recipe_steps = await axios.get(`${api_domain}/${recipe_id}/analyzedInstructions?`, {
    params: {
      apiKey: process.env.spooncular_apiKey
    }
  });

  let steps_list = [];
  let steps = recipe_steps.data[0].steps;
  for (let step of steps) {
    let stepNumber = step.number;
    let instruction = step.step;

    let stepPair = {
      stepNumber,
      instruction
    };

    steps_list.push(stepPair);
  }

  return steps_list;
}

// get full recipe data from spooncular response
async function getRecipeFullData(recipe_id) {
  let recipeInfo = await getRecipeInformation(recipe_id);
  let ingredients = await getRecipeIngredients(recipe_id);
  let steps = await getRecipeStep(recipe_id);

  let fullData = {
    recipeInfo: await getRecipePreviewData(recipeInfo.data),
    ingredients,
    steps
  };

  return fullData;
}

// get recipe preview data from spooncular response
async function getRecipePreviewData(recipe_data) {
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

//get recipe details by id
async function getRecipeDetails(recipe_id) {
  let recipe_info = await getRecipeInformation(recipe_id);
  return await getRecipePreviewData(recipe_info.data);
}

//get 3 random recipes from spooncular
async function getRandomRecipe() {
  let random_recipes = await axios.get(`${api_domain}/random?number=3`, {
    params: {
      apiKey: process.env.spooncular_apiKey
    }
  });

  let random_recipes_info = [];
  // gets only the relvant data from each recipe
  for (let recipe of random_recipes.data.recipes) {
    random_recipes_info.push(await getRecipePreviewData(recipe));
  }

  return random_recipes_info;
}

// searches for recipes by filters and query
async function searchRecipes(filters) {
  const startTime = new Date().getTime(); // Start time in milliseconds


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




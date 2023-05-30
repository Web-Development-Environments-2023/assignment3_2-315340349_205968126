const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const api_key = process.env.spooncular_apiKey;



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



async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}

async function getRandomRecipe() {
    let random_recipes = await axios.get(`${api_domain}/random?number=3&apiKey=${api_key}`, {
      params: {
        apiKey: process.env.spooncular_apiKey
      }
    });
  
    let random_recipes_info = [];
  
    for (let recipe of random_recipes.data.recipes) {
      let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe;
  
      let recipe_info = {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree
      };
  
      random_recipes_info.push(recipe_info);
    }
  
    return random_recipes_info;
  }



exports.getRandomRecipe = getRandomRecipe;
exports.getRecipeDetails = getRecipeDetails;




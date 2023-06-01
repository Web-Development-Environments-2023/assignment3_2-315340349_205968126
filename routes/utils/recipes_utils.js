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

async function getRecipePreviewData(recipe_data) {
  let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_data;

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

async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    // let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    // return {
    //     id: id,
    //     title: title,
    //     readyInMinutes: readyInMinutes,
    //     image: image,
    //     popularity: aggregateLikes,
    //     vegan: vegan,
    //     vegetarian: vegetarian,
    //     glutenFree: glutenFree,
        
    // }
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
      // let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe;
  
      // let recipe_info = {
      //   id: id,
      //   title: title,
      //   readyInMinutes: readyInMinutes,
      //   image: image,
      //   popularity: aggregateLikes,
      //   vegan: vegan,
      //   vegetarian: vegetarian,
      //   glutenFree: glutenFree
      // };
  
      // random_recipes_info.push(recipe_info);
      random_recipes_info.push(await getRecipePreviewData(recipe));
    }
  
    return random_recipes_info;
  }

  //searches for recipes by filters and query
  async function searchRecipes(filters) {
    let recipes = await axios.get(`${api_domain}/complexSearch`, {
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

    //gets the details of each recipe, since complexSearch dosent return all the details we are using getRecipeDetails for that.
    let search_recipes = [];
    for (let recipe of recipes.data.results) {
        // let { id } = recipe;
        // let recipeDetails = await getRecipeDetails(id);
        // let { title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipeDetails;

        // let recipe_info = {
        //     id: id,
        //     title: title,
        //     readyInMinutes: readyInMinutes,
        //     image: image,
        //     popularity: aggregateLikes,
        //     vegan: vegan,
        //     vegetarian: vegetarian,
        //     glutenFree: glutenFree
        // };

        // search_recipes.push(recipe_info);
        search_recipes.push(await getRecipePreviewData(recipe));
    }

    return search_recipes;
}







exports.searchRecipes = searchRecipes;
exports.getRandomRecipe = getRandomRecipe;
exports.getRecipeDetails = getRecipeDetails;




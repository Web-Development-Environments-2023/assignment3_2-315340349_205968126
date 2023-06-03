var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));


router.get("/getRecipeFullData/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeFullData(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

//route for getting recipes, before we send requests to spooncular we check if the request is being forwared properly so we wont waste cradintels on spooncular
router.get("/searchForRecepie", async (req, res, next) => {
  try {
    const{query, diet, cuisine, intolerance, number} = req.query;
    if(!query && !diet && !cuisine && !intolerance){
      return res.status(400).send("You must enter at least one parameter");
    }
    const filters = {}
    if(diet){
      filters.diet = diet;
    }
    if(cuisine){
      filters.cuisine = cuisine;
    }
    if(intolerance){
      filters.intolerance = intolerance;
    }
    if(query){
      filters.query = query;
    }
    
    filters.numOfRecipes = number || 5;

    const recipes = await recipes_utils.searchRecipes(filters);
    res.send(recipes);
  } catch (error) {
    next(error);
  }
});

// route for getting 3 random recipes
router.get("/getRandoms", async (req, res, next) => {
  try {
    const random_recipe = await recipes_utils.getRandomRecipe();
    res.status(200).send(random_recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});



module.exports = router;


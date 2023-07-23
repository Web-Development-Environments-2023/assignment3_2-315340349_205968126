var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
// router.use(async function (req, res, next) {
//   if (req.session && req.session.user_id) {
//     DButils.execQuery("SELECT user_id FROM users").then((users) => {
//       if (users.find((x) => x.user_id === req.session.user_id)) {
//         req.user_id = req.session.user_id;
//         next();
//       }
//     }).catch(err => next(err));
//   } else {
//     res.sendStatus(401);
//   }
// });

/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = 5; //TODO: req.session.user_id;
    const recipe_id = req.body.recipe_id;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
});

router.get('/favoriteandWatched/:recipeId', async (req,res,next) => {
  try{
    const user_id = 5; //TODO: req.session.user_id;
    const recipe_id = req.params.recipeId;
    const isFavorite = await user_utils.isFavorite(user_id,recipe_id);
    const isWatched = await user_utils.isWatched(user_id,recipe_id);
    const results = { isFavorite: isFavorite, isWatched: isWatched };
    res.status(200).send(results);
    }
    catch(error){
    next(error);
  }
});

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = 5; //TODO: req.session.user_id;
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await Promise.all(recipes_id_array.map((element) => recipe_utils.getRecipeDetails(element)));
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

/**
 *  this path gets body with recipe detalis and save this recipe in the list of the logged-in user
 * */ 
router.post('/addRecipe' , async (req,res,next) => {
  try{
    const user_id = 5; //TODO: req.session.user_id;
    await user_utils.AddRecipe(user_id,req.body);
    res.status(200).send("The Recipe successfully saved as your recipe");
    } catch(error){
    next(error);
  }
});

router.get('/getMyRecipe/:recipeId' , async (req,res,next) => {
  try{
    const user_id = 5; //TODO: req.session.user_id;
    const recipe_id = req.params.recipeId;
    const results = await user_utils.getMyFullRecipe(recipe_id);
    console.log(res);
    res.status(200).send(results);
    } catch(error){
    next(error);
  }
});

/**
 * This path returns the recipes that were saved by the logged-in user
 */
router.get('/myRecipes', async (req,res,next) => {
  try{
    const user_id = 5; //TODO: req.session.user_id;
    const recipes = await user_utils.getMyRecipes(user_id);
    // let recipes_id_array = [];
    // recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    // const results = await Promise.all(recipes_id_array.map((element) => recipe_utils.getRecipeDetails(element)));
    res.status(200).send(recipes);
  } catch(error){
    next(error);
  }
});

router.get('/myFamilyRecipes', async (req,res,next) => {
  try{
    const user_id = 5; //TODO: req.session.user_id;
    const recipes = await user_utils.getFamilyRecipes(user_id);
    // let recipes_id_array = [];
    // recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    // const results = await Promise.all(recipes_id_array.map((element) => recipe_utils.getRecipeDetails(element)));
    res.status(200).send(recipes);
  } catch(error){
    next(error);
  }
});

/**
 * This path returns the last watched recipes of the logged-in user
 */
router.get('/getLastWatched', async (req,res,next) => {
  try{
    const user_id = 5;//TODO: req.session.user_id;
    const recipes_id = await user_utils.getLastWatchedRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await Promise.all(recipes_id_array.map((element) => recipe_utils.getRecipeDetails(element)));
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

router.post('/updateLastWatched', async (req,res,next) => {
  try{
    const user_id = 5;//TODO: req.session.user_id;
    const recipe_id = req.body.recipe_id;
    await user_utils.markAsWatched(user_id,recipe_id);
    res.status(200).send("The Recipe last watched successfully saved/updated");
    }
    catch(error){
    next(error);
  }
});

module.exports = router;

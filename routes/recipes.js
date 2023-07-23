var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

/**
 * test route
 */
router.get("/", (req, res) => res.send("im here"));

/**
 * This path gets recipe id and returns the recipe's full data
 */
//TODO: uncomment this route and delete the next one
router.get("/getRecipeFullData/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeFullData(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});
// router.get("/getRecipeFullData/:recipeId", async (req, res, next) => {
  // try {
  //   // // real reqest to spooncular
  //   // const recipe = await recipes_utils.getRecipeFullData(req.params.recipeId);
  //   // saved request to spooncular for testing
  //   const recipe = {
  //     "recipeInfo": {
  //         "id": 636096,
  //         "title": "Bridget Jones's Shepherd's Pie",
  //         "readyInMinutes": 45,
  //         "image": "https://spoonacular.com/recipeImages/636096-556x370.jpg",
  //         "popularity": 2,
  //         "vegan": false,
  //         "glutenFree": false,
  //         "servings": 4
  //     },
  //     "ingredients": [
  //         {
  //             "ingredient": "onions",
  //             "amount": {
  //                 "metric": {
  //                     "unit": "",
  //                     "value": 2
  //                 }
  //             }
  //         },
  //         {
  //             "ingredient": "olive oil",
  //             "amount": {
  //                 "metric": {
  //                     "unit": "Tbsps",
  //                     "value": 2
  //                 }
  //             }
  //         },
  //         {
  //             "ingredient": "lamb",
  //             "amount": {
  //                 "metric": {
  //                     "unit": "grams",
  //                     "value": 600
  //                 }
  //             }
  //         },
  //         {
  //             "ingredient": "plain flour",
  //             "amount": {
  //                 "metric": {
  //                     "unit": "Tbsps",
  //                     "value": 2
  //                 }
  //             }
  //         },
  //         {
  //             "ingredient": "thyme",
  //             "amount": {
  //                 "metric": {
  //                     "unit": "servings",
  //                     "value": 4
  //                 }
  //             }
  //         },
  //         {
  //             "ingredient": "rosemary",
  //             "amount": {
  //                 "metric": {
  //                     "unit": "servings",
  //                     "value": 4
  //                 }
  //             }
  //         },
  //         {
  //             "ingredient": "canned tomatoes",
  //             "amount": {
  //                 "metric": {
  //                     "unit": "small",
  //                     "value": 1
  //                 }
  //             }
  //         },
  //         {
  //             "ingredient": "lamb stock",
  //             "amount": {
  //                 "metric": {
  //                     "unit": "milliliters",
  //                     "value": 100
  //                 }
  //             }
  //         },
  //         {
  //             "ingredient": "black salt and pepper",
  //             "amount": {
  //                 "metric": {
  //                     "unit": "servings",
  //                     "value": 4
  //                 }
  //             }
  //         },
  //         {
  //             "ingredient": "potatoes",
  //             "amount": {
  //                 "metric": {
  //                     "unit": "grams",
  //                     "value": 700
  //                 }
  //             }
  //         },
  //         {
  //             "ingredient": "milk",
  //             "amount": {
  //                 "metric": {
  //                     "unit": "milliliters",
  //                     "value": 55
  //                 }
  //             }
  //         },
  //         {
  //             "ingredient": "butter",
  //             "amount": {
  //                 "metric": {
  //                     "unit": "grams",
  //                     "value": 75
  //                 }
  //             }
  //         },
  //         {
  //             "ingredient": "egg yolk",
  //             "amount": {
  //                 "metric": {
  //                     "unit": "",
  //                     "value": 1
  //                 }
  //             }
  //         }
  //     ],
  //     "steps": [
  //         {
  //             "stepNumber": 1,
  //             "instruction": "Preheat the oven to 180 C."
  //         },
  //         {
  //             "stepNumber": 2,
  //             "instruction": "In a large frying pan, heat a little olive oil and fry the chopped onion and garlic."
  //         },
  //         {
  //             "stepNumber": 3,
  //             "instruction": "Add the mince, stirring, until browned all over."
  //         },
  //         {
  //             "stepNumber": 4,
  //             "instruction": "While the meat is frying, break up any lumps with the back of the spoon."
  //         },
  //         {
  //             "stepNumber": 5,
  //             "instruction": "Add the flour (this helps to thicken the juices) and stir."
  //         },
  //         {
  //             "stepNumber": 6,
  //             "instruction": "Mix well and add the thyme and the rosemary and stir."
  //         },
  //         {
  //             "stepNumber": 7,
  //             "instruction": "Add the chopped tomatoes and pour the stock mixture."
  //         },
  //         {
  //             "stepNumber": 8,
  //             "instruction": "Add a pinch of salt and freshly ground black pepper and let it simmer for about 5 minutes."
  //         },
  //         {
  //             "stepNumber": 9,
  //             "instruction": "For the mash, boil the potatoes, then drain them in a sieve and place into a clean bowl."
  //         },
  //         {
  //             "stepNumber": 10,
  //             "instruction": "Add the milk, butter and egg yolk, and mash together."
  //         },
  //         {
  //             "stepNumber": 11,
  //             "instruction": "Season with salt and freshly ground black pepper."
  //         },
  //         {
  //             "stepNumber": 12,
  //             "instruction": "Pour the meat into an ovenproof dish and spread the mash on top, smooth over and mark with a spatula."
  //         },
  //         {
  //             "stepNumber": 13,
  //             "instruction": "Put the dish into the oven and cook until the surface is bubbling and golden-brown."
  //         }
  //     ]
  // };
  //   res.send(recipe);
  // } catch (error) {
  //   next(error);
  // }
// });

/**
 * This path returns a list of recipes that the user searched by query
 */
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

/**
 * This path returns 3 random recipes
 */
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


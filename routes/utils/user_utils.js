const DButils = require("./DButils");

/**
 * Mark recipe as favorite by user
 * @param {*} user_id
 * @param {*} recipe_id
 */
async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

/**
 * Mark recipe as watched by user
 * @param {*} user_id
 * @param {*} recipe_id
 */
async function markAsWatched(user_id, recipe_id) {
  const existingRow = await DButils.execQuery(`SELECT * FROM RecipeViews WHERE user_id = '${user_id}' AND recipe_id = ${recipe_id}`);

  if (existingRow.length > 0) {
    // Row already exists, update the timestamp
    await DButils.execQuery(`UPDATE RecipeViews SET viewed_at = CURRENT_TIMESTAMP WHERE user_id = '${user_id}' AND recipe_id = ${recipe_id}`);
  } else {
    // Row doesn't exist, insert a new row
    await DButils.execQuery(`INSERT INTO RecipeViews VALUES ('${user_id}', ${recipe_id}, CURRENT_TIMESTAMP)`);
  }
}

/**
 * Add recipe to user's recipes
 * @param {*} user_id
 * @param {*} body
 */
async function AddRecipe(user_id, body) {
  const recipe_info = body.recipeInfo;
  const recipe_ingredients = body.ingredients;
  const recipe_instructions = body.steps;

  await DButils.execQuery(`INSERT INTO Recipe (name, time_to_cook, vegan, gluten_free, instructions, number_of_dishes, popularity, image) VALUES 
      ('${recipe_info.name}', '${recipe_info.cooking_time}', '${recipe_info.vegan}', '${recipe_info.glutenFree}', 
      '${recipe_info.instructions}', '${recipe_info.servings}', '${recipe_info.likes}', '${recipe_info.image}')`);

    const insertedRecipeId = (await DButils.execQuery('SELECT LAST_INSERT_ID() AS recipe_id'))[0].recipe_id;

    await DButils.execQuery(`INSERT INTO MyRecipes (user_id, recipe_id) VALUES ('${user_id}', ${insertedRecipeId})`);

  for (const ingredient of recipe_ingredients) {
      const existingIngredient = await DButils.execQuery(`SELECT * FROM Ingredients WHERE ingredient_name = '${ingredient.name}'`);
    if (existingIngredient.length == 0) {
        await DButils.execQuery(`INSERT INTO Ingredients (ingredient_name) VALUES ('${ingredient.name}')`);
    }
      const ingredientID = (await DButils.execQuery(`SELECT ingredient_id FROM Ingredients WHERE ingredient_name = '${ingredient.name}'`))[0].ingredient_id;
    await DButils.execQuery(`INSERT INTO RecipeIngredients (recipe_id, ingredient_id, unit, value) VALUES 
                                  ('${insertedRecipeId}', '${ingredientID}', '${ingredient.amount.metric.unit}', '${ingredient.amount.metric.value}')`);
  }

  for (const step of recipe_instructions) {
    await DButils.execQuery(`INSERT INTO Steps (recipe_id, step_number, step_instruction) VALUES 
        ('${insertedRecipeId}', '${step.stepNumber}', '${step.instruction}')`);
  }
}

/**
 * Get user's favorite recipes
 * @param {*} user_id
 * @returns favorite recipes list
 */
async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
  return recipes_id;
}

/**
 * Get user's last watched recipes
 * @param {*} user_id
 * @returns last watched recipes list
 */
async function getLastWatchedRecipes(user_id){
    const recipes_id = await DButils.execQuery(`SELECT user_id, recipe_id, viewed_at
                                                FROM RecipeViews
                                                WHERE user_id = '${user_id}'
                                                ORDER BY viewed_at DESC
                                                LIMIT 3;`);
  return recipes_id;
}

/**
 * Get user's recipes
 * @param {*} user_id
 * @returns user's recipes list
 */
async function getMyRecipes(user_id) {
  const userRecipes = await DButils.execQuery(`SELECT * FROM Recipe WHERE recipe_id IN
                           (SELECT recipe_id FROM MyRecipes WHERE user_id = '${user_id}')`);
  return userRecipes;
}

/**
 * Get user's family recipes
 * @param {*} user_id
 * @returns user's family recipes list
 */
async function getFamilyRecipes(user_id) {
  const userRecipes = await DButils.execQuery(`SELECT * FROM Recipe WHERE recipe_id IN
                           (SELECT recipe_id FROM familyRecipes WHERE user_id = '${user_id}')`);
  return userRecipes;
}

async function getMyFullRecipe(recipe_id) {
  const recipeDetails = await DButils.execQuery(
    `SELECT * FROM Recipe WHERE recipe_id = '${recipe_id}'`
  );
  const ingredients =
    await DButils.execQuery(`SELECT i.ingredient_name, r.unit, r.value FROM recipeingredients r
                              JOIN ingredients i ON r.ingredient_id = i.ingredient_id
                              WHERE r.recipe_id = '${recipe_id}'`);
  const steps = await DButils.execQuery(
    `SELECT step_number, step_instruction FROM Steps WHERE recipe_id = '${recipe_id}'`
  );
  const recipe = {
    "recipeInfo": {
      "id": recipeDetails.recipe_id,
      "title": recipeDetails.title,
      "readyInMinutes": recipeDetails.readyInMinutes,
      "image": recipeDetails.image,
      "popularity": recipeDetails.popularity,
      "vegan": recipeDetails.vegan,
      "vegetarian": recipeDetails.vegetarian,
      "glutenFree": recipeDetails.glutenFree,
      "servings": recipeDetails.servings
    },
    "ingredients": ingredients.map(ingredient => ({
      "ingredient": ingredient.ingredient_name,
      "amount": {
        "metric": {
          "unit": ingredient.unit,
          "value": ingredient.value
        }
      }
    })),
    "steps": steps.map(step => ({
      "stepNumber": step.step_number,
      "instruction": step.step_instruction
    }))
  };
  return recipe;
  }

exports.markAsWatched = markAsWatched;
exports.AddRecipe = AddRecipe;
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getLastWatchedRecipes = getLastWatchedRecipes;
exports.getMyRecipes = getMyRecipes;
exports.getFamilyRecipes = getFamilyRecipes;
exports.getMyFullRecipe = getMyFullRecipe;

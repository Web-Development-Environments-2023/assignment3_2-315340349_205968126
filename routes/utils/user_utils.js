const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

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
    // for (const ingredient of recipe_ingredients) {
    //   await DButils.execQuery(`INSERT INTO Ingredients (ingredient_name) VALUES ('${ingredient.name}')`);
    //   const ingredientID = (await DButils.execQuery(`SELECT ingredient_id FROM Ingredients WHERE ingredient_name = '${ingredient.name}'`))[0].ingredient_id;
    //   await DButils.execQuery(`INSERT INTO RecipeIngredients (recipe_id, ingredient_id, unit, value) VALUES 
    //     ('${insertedRecipeId}', '${ingredientID}', '${ingredient.amount.metric.unit}', '${ingredient.amount.metric.value}')`);
    // }
    
    for (const step of recipe_instructions) {
      await DButils.execQuery(`INSERT INTO Steps (recipe_id, step_number, step_instruction) VALUES 
        ('${insertedRecipeId}', '${step.stepNumber}', '${step.instruction}')`);
    }
  }
  

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}

async function getLastWatchedRecipes(user_id){
    const recipes_id = await DButils.execQuery(`SELECT user_id, recipe_id, viewed_at
                                                FROM RecipeViews
                                                WHERE user_id = '${user_id}'
                                                ORDER BY viewed_at DESC
                                                LIMIT 3;`);
    return recipes_id;
}

async function getMyRecipes(user_id) {
  const userRecipes = await DButils.execQuery(`SELECT * FROM Recipe WHERE recipe_id IN
                           (SELECT recipe_id FROM MyRecipes WHERE user_id = '${user_id}')`);
  return userRecipes;
}

async function getFamilyRecipes(user_id) {
  const userRecipes = await DButils.execQuery(`SELECT * FROM Recipe WHERE recipe_id IN
                           (SELECT recipe_id FROM familyRecipes WHERE user_id = '${user_id}')`);
  return userRecipes;
}

exports.AddRecipe = AddRecipe;
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getLastWatchedRecipes = getLastWatchedRecipes;
exports.getMyRecipes = getMyRecipes;
exports.getFamilyRecipes = getFamilyRecipes;

const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
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


exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getLastWatchedRecipes = getLastWatchedRecipes;

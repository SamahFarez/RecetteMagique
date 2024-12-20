
use("recette");

// Insert a new user document into the Users collection
db.Users.insertOne({
    full_name: "John Doe",
    email: "john.doe@example.com",
    password: "hashedpassword123", // Make sure to hash the password in your app
    isVerified: false,
    dietaryRestrictions: [],  // Will be added as references later
    cuisinePreferences: [],    // Will be added as references later
    ingredients: [],           // Will be added as references later
    userRecipes: []            // Will be added as references later
  });
  

  // Insert dietary restriction documents
db.DietaryRestrictions.insertMany([
    {
      category: "Vegan",
      subcategory: "None",
      ingredient: "Milk",
      allowed: false
    },
    {
      category: "Gluten-Free",
      subcategory: "None",
      ingredient: "Wheat",
      allowed: false
    },
    {
      category: "Vegetarian",
      subcategory: "None",
      ingredient: "Egg",
      allowed: true
    }
  ]);
  

// Link user to their dietary restrictions in User_Restrictions
db.User_Restrictions.insertMany([
    {
      user_id: ObjectId("64a6b2bb8f97d12ab8b8f8a9"),  // User's _id
      restriction_id: ObjectId("64a6b2bb8f97d12ab8b8f8a1")  // Vegan restriction
    },
    {
      user_id: ObjectId("64a6b2bb8f97d12ab8b8f8a9"),  // User's _id
      restriction_id: ObjectId("64a6b2bb8f97d12ab8b8f8a2")  // Gluten-Free restriction
    }
  ]);
  


  // Insert cuisine preferences for the user
db.CuisinePreferences.insertOne({
    user_id: ObjectId("64a6b2bb8f97d12ab8b8f8a9"),  // User's _id
    cuisine_type: "Italian",
    image_url: "https://example.com/italian_image.jpg",
    is_favorite: true
  });
  
  db.CuisinePreferences.insertOne({
    user_id: ObjectId("64a6b2bb8f97d12ab8b8f8a9"),  // User's _id
    cuisine_type: "Indian",
    image_url: "https://example.com/indian_image.jpg",
    is_favorite: false
  });
  


  // Insert ingredients for the user
db.Ingredients.insertMany([
    {
      user_id: ObjectId("64a6b2bb8f97d12ab8b8f8a9"),  // User's _id
      ingredient_name: "Tomato",
      is_available: true
    },
    {
      user_id: ObjectId("64a6b2bb8f97d12ab8b8f8a9"),  // User's _id
      ingredient_name: "Olive Oil",
      is_available: true
    }
  ]);
  
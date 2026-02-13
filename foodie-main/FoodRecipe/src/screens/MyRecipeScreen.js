import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useFocusEffect } from "@react-navigation/native";

export default function MyRecipeScreen() {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recipes from AsyncStorage
  useFocusEffect(
    React.useCallback(() => {
      const fetchRecipes = async () => {
        try {
          const storedRecipes = await AsyncStorage.getItem("customrecipes");
          if (storedRecipes) {
            setRecipes(JSON.parse(storedRecipes));
          } else {
            setRecipes([]); // explicitly set empty if none
          }
        } catch (error) {
          console.error("Error fetching recipes:", error);
          setRecipes([]);
        } finally {
          setLoading(false);
        }
      };

      fetchRecipes();
    }, [])
  );

  // Navigate to add recipe form
  const handleAddRecipe = () => {
    navigation.navigate("RecipesFormScreen");
  };

  // Navigate to recipe detail
  const handleRecipeClick = (recipe) => {
    navigation.navigate("CustomRecipesScreen", { recipe });
  };

  // Delete a recipe
  const deleteRecipe = async (index) => {
    try {
      const updatedRecipes = [...recipes];
      updatedRecipes.splice(index, 1);
      await AsyncStorage.setItem(
        "customrecipes",
        JSON.stringify(updatedRecipes)
      );
      setRecipes(updatedRecipes);
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  // Edit a recipe
  const editRecipe = (recipe, index) => {
    navigation.navigate("RecipesFormScreen", {
      recipeToEdit: recipe,
      recipeIndex: index,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F75FF" />
      </View>
    );
  }

  if (recipes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
        <Text style={styles.emptyText}>No recipes added yet!</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddRecipe}>
          <Text style={styles.addButtonText}>Add Recipe</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {recipes.map((recipe, index) => (
        <View key={index} style={styles.recipeCard}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleRecipeClick(recipe)}>
            {recipe.image ? (
              <Image
                source={{ uri: recipe.image }}
                style={styles.recipeImage}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text>No Image</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          <Text style={styles.recipeDescription}>
            {recipe.description
              ? recipe.description.substring(0, 50) +
                (recipe.description.length > 50 ? "…" : "")
              : ""}
          </Text>

          {/* Edit/Delete buttons */}
          <View
            style={styles.actionButtonsContainer}
            testID="editDeleteButtons"
          >
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => editRecipe(recipe, index)}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteRecipe(index)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={styles.addButtonBottom}
        onPress={handleAddRecipe}
      >
        <Text style={styles.addButtonText}>Add Recipe</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: wp(4),
    paddingBottom: hp(4),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: wp(4),
  },
  emptyText: {
    fontSize: hp(2.5),
    color: "#6B7280",
    marginBottom: hp(2),
  },
  recipeCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: wp(3),
    marginBottom: hp(2),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  recipeImage: {
    width: "100%",
    height: hp(25),
    borderRadius: 10,
    marginBottom: hp(1),
  },
  imagePlaceholder: {
    width: "100%",
    height: hp(25),
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(1),
  },
  recipeTitle: {
    fontSize: hp(2.2),
    fontWeight: "bold",
    color: "#4B5563",
    marginBottom: hp(0.5),
  },
  recipeDescription: {
    fontSize: hp(1.6),
    color: "#4B5563",
    marginBottom: hp(1),
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButton: {
    backgroundColor: "#2563EB",
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(3),
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(3),
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#4F75FF",
    padding: hp(1.2),
    borderRadius: 5,
    marginTop: hp(2),
  },
  addButtonBottom: {
    backgroundColor: "#4F75FF",
    padding: hp(1.2),
    borderRadius: 5,
    marginTop: hp(2),
    alignItems: "center",
    alignSelf: "center",
    width: wp(50),
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  backButton: {
    padding: 8,
    borderRadius: 50,
    marginLeft: wp(4),
    backgroundColor: "white",
  },
  backButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
});

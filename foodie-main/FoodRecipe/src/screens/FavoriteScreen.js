import React from "react";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function FavoriteScreen() {
  const navigation = useNavigation();
  const favoriteRecipesList = useSelector(
    (state) => state.favorites.favoriterecipes || []
  );

  if (favoriteRecipesList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No favorite recipes yet!</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={{ color: "#fff" }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: wp(4), paddingTop: hp(2) }}>
      <Text style={styles.heading}>My Favorite Recipes</Text>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButtonSmall}
      >
        <Text style={{ color: "#fff" }}>Go back</Text>
      </TouchableOpacity>

      <FlatList
        data={favoriteRecipesList}
        keyExtractor={(item) => item.idFood.toString()}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          marginBottom: hp(2),
        }}
        contentContainerStyle={{
          paddingTop: hp(2),
          paddingHorizontal: wp(4),
          alignItems: "flex-start",
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recipeCard}
            onPress={() => navigation.navigate("RecipeDetail", { item })}
          >
            <Image
              source={{ uri: item.recipeImage }}
              style={styles.recipeImage}
            />
            <Text style={styles.recipeTitle} numberOfLines={1}>
              {item.recipeName.length > 20
                ? item.recipeName.substring(0, 20) + "..."
                : item.recipeName}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: hp(2.5),
    color: "#6B7280",
  },
  backButton: {
    backgroundColor: "#2563EB",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: 120,
    alignItems: "center",
  },
  backButtonSmall: {
    backgroundColor: "#2563EB",
    padding: 8,
    borderRadius: 5,
    marginVertical: 10,
    width: 100,
    alignItems: "center",
  },
  heading: {
    fontSize: hp(3.8),
    fontWeight: "600",
    color: "#374151", // text-neutral-700
    marginBottom: 10,
  },
  recipeCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  recipeImage: {
    width: wp(40),
    height: wp(40),
    borderRadius: 10,
    marginBottom: 10,
  },
  recipeTitle: {
    fontSize: hp(2),
    fontWeight: "bold",
    color: "#4B5563",
    textAlign: "center",
  },
});

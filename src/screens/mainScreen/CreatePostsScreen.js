import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CreatePostsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Posts Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontFamily: "Montserrat-Thin",
    fontSize: 32,
  },
});

export default CreatePostsScreen;

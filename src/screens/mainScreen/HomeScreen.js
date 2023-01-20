import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import CreatePostsScreen from "./CreatePostsScreen";
import ProfileScreen from "./ProfileScreen";
import MapScreen from "./MapScreen";
import CommentsScreen from "./CommentsScreen";
import PostsScreen from "./PostsScreen";

const HomeStack = createBottomTabNavigator();

export default function HomeScreen({ navigation }) {
  const { path } = useSelector((state) => state.path);

  const dispatch = useDispatch();

  return (
    <HomeStack.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: "#fff", color: "#fff" },
        headerStyle: {
          backgroundColor: "#fff",
          boxShadow: "0px 0.5px 0px rgba(0, 0, 0, 0.3)",
        },
        headerTitleAlign: "center",
        headerTitleStyle: {
          color: "#212121",
          fontFamily: "Montserrat-Regular",
          fontSize: 24,
        },
        headerPressColor: "#4169e1",
      }}
    >
      <HomeStack.Screen
        options={{
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => dispatch(authSignOutUser())}
              style={{ marginRight: 10 }}
            >
              <MaterialIcons name="logout" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ focused }) => (
            <Feather
              name="grid"
              size={24}
              color={focused ? "#FF6C00" : "rgba(33, 33, 33, 0.8)"}
            />
          ),
        }}
        name="Posts"
        component={PostsScreen}
      />
      <HomeStack.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="add"
              size={24}
              color={focused ? "#FF6C00" : "rgba(33, 33, 33, 0.8)"}
            />
          ),
          headerLeft: () => (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.logOut}
              onPress={() => navigation.navigate("Posts")}
            >
              <AntDesign
                name="arrowleft"
                size={24}
                color="rgba(33, 33, 33, 0.8)"
              />
            </TouchableOpacity>
          ),
          tabBarStyle: { display: "none" },
        }}
        name="Create post"
        component={CreatePostsScreen}
      />
      <HomeStack.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Feather
              name="user"
              size={24}
              color={focused ? "#FF6C00" : "rgba(33, 33, 33, 0.8)"}
            />
          ),
        }}
        name="Profile"
        component={ProfileScreen}
      />
      <HomeStack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.logOut}
              onPress={() => {
                path ? navigation.navigate(path) : navigation.navigate("Posts");
              }}
            >
              <AntDesign
                name="arrowleft"
                size={24}
                color="rgba(33, 33, 33, 0.8)"
              />
            </TouchableOpacity>
          ),
          tabBarButton: () => null,
          tabBarVisible: false,
          tabBarStyle: { display: "none" },
        }}
        name="Map"
        component={MapScreen}
      />
      <HomeStack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.logOut}
              onPress={() => {
                path ? navigation.navigate(path) : navigation.navigate("Posts");
              }}
            >
              <AntDesign
                name="arrowleft"
                size={24}
                color="rgba(33, 33, 33, 0.8)"
              />
            </TouchableOpacity>
          ),
          tabBarButton: () => null,
          tabBarVisible: false,
          tabBarStyle: { display: "none" },
        }}
        name="Comments"
        component={CommentsScreen}
      />
    </HomeStack.Navigator>
  );
}

const styles = StyleSheet.create({
  logOut: {
    padding: 10,
  },
});

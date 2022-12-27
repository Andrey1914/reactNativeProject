import React from "react";
import { useSelector } from "react-redux";
import { TouchableOpacity, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import CreatePostsScreen from "./CreatePostsScreen";
import ProfileScreen from "./ProfileScreen";
import MapScreen from "./MapScreen";
import CommentsScreen from "./CommentsScreen";
import PostsScreen from "./PostsScreen";

const HomeStack = createBottomTabNavigator();

export default function HomeScreen({ navigation }) {
  const { path } = useSelector((state) => state.path);

  return (
    <HomeStack.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: "#515151", color: "#fff" },
        headerStyle: { backgroundColor: "#515151" },
        headerTitleAlign: "center",
        headerTitleStyle: {
          color: "#fff",
          fontFamily: "Montserrat-Regular",
          fontSize: 24,
        },
        headerPressColor: "#4169e1",
      }}
    >
      <HomeStack.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="appstore-o"
              size={24}
              color={focused ? "#4169e1" : "#fff"}
            />
          ),
        }}
        name="Posts"
        component={PostsScreen}
      />
      <HomeStack.Screen
        options={{
          // headerShown: false,
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="plus-square-o"
              size={24}
              color={focused ? "#4169e1" : "#fff"}
            />
          ),
          headerLeft: ({ pressColor }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.logOut}
              onPress={() => navigation.navigate("Posts")}
            >
              <AntDesign name="arrowleft" size={24} color={pressColor} />
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
            <AntDesign
              name="user"
              size={24}
              color={focused ? "#4169e1" : "#fff"}
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
              <AntDesign name="arrowleft" size={24} color="#4169e1" />
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
              <AntDesign name="arrowleft" size={24} color="#4169e1" />
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

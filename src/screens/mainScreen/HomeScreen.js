// import React from "react";
// import { useSelector, useDispatch } from "react-redux";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
// import { Feather } from "@expo/vector-icons";
// import { MaterialIcons } from "@expo/vector-icons";

import CreatePostsScreen from "./CreatePostsScreen";
import ProfileScreen from "./ProfileScreen";
// import MapScreen from "./MapScreen";
// import CommentsScreen from "./CommentsScreen";
import PostsScreen from "./PostsScreen";

// const HomeStack = createBottomTabNavigator();
const MainTab = createBottomTabNavigator();

export default function HomeScreen() {
  // const { path } = useSelector((state) => state.path);

  // const dispatch = useDispatch();

  return (
    <MainTab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#ffffff",
        tabBarStyle: styles.tabBarStyle,
        headerTitleAlign: "center",
        headerTitleStyle: {
          color: "#212121",
          fontFamily: "Montserrat-Regular",
          fontSize: 18,
          lineHeight: 22,
          letterSpacing: 0.5,
          paddingLeft: 15,
          paddingRight: 15,
        },
      }}
    >
      <MainTab.Screen
        name="Posts"
        component={PostsScreen}
        options={({ route }) => ({
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "";
            if (routeName === "Comments" || routeName === "Map") {
              return { display: "none" };
            }
            return { height: 85, paddingLeft: 80, paddingRight: 80 };
          })(route),
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <View
              style={{
                ...styles.tabIconWrapperStyle,
                borderBottomColor: focused ? "#212121" : "#ffffff",
              }}
            >
              <Ionicons
                style={{
                  ...styles.tabIconStyle,
                  backgroundColor: focused ? "#FF6C00" : "#ffffff",
                }}
                name="grid-outline"
                size={24}
                color={color}
              />
            </View>
          ),
        })}
      />
      <MainTab.Screen
        name="CreatePosts"
        component={CreatePostsScreen}
        options={({ navigation }) => ({
          title: "Create new publication",
          tabBarHideOnKeyboard: true,
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 16 }}
              onPress={() => navigation.goBack()}
            >
              <AntDesign
                name="arrowleft"
                size={24}
                color="rgba(33,33,33,0.8)"
              />
            </TouchableOpacity>
          ),
          tabBarStyle: {
            display: "none",
          },
          tabBarIcon: ({ focused, color }) => (
            <View
              style={{
                ...styles.tabIconWrapperStyle,
                borderBottomColor: focused ? "#212121" : "#ffffff",
              }}
            >
              <AntDesign
                style={{
                  ...styles.tabIconStyle,
                  backgroundColor: focused ? "#FF6C00" : "#ffffff",
                }}
                name="plus"
                size={24}
                color={color}
              ></AntDesign>
            </View>
          ),
        })}
      />
      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <View
              style={{
                ...styles.tabIconWrapperStyle,
                borderBottomColor: focused ? "#212121" : "#ffffff",
              }}
            >
              <Feather
                style={{
                  ...styles.tabIconStyle,
                  backgroundColor: focused ? "#FF6C00" : "#ffffff",
                }}
                name="user"
                size={24}
                color={color}
              ></Feather>
            </View>
          ),
        }}
      />
    </MainTab.Navigator>
    // <HomeStack.Navigator
    //   screenOptions={{
    //     tabBarShowLabel: false,
    //     tabBarStyle: { backgroundColor: "#fff", color: "#fff" },
    //     headerStyle: {
    //       backgroundColor: "#fff",
    //       boxShadow: "0px 0.5px 0px rgba(0, 0, 0, 0.3)",
    //     },
    //     headerTitleAlign: "center",
    //     headerTitleStyle: {
    //       color: "#212121",
    //       fontFamily: "Montserrat-Regular",
    //       fontSize: 24,
    //     },
    //     headerPressColor: "#4169e1",
    //   }}
    // >
    //   <HomeStack.Screen
    //     options={{
    //       headerShown: true,
    //       headerRight: () => (
    //         <TouchableOpacity
    //           onPress={() => dispatch(authSignOutUser())}
    //           style={{ marginRight: 10 }}
    //         >
    //           <MaterialIcons name="logout" size={24} color="#BDBDBD" />
    //         </TouchableOpacity>
    //       ),
    //       tabBarIcon: ({ focused }) => (
    //         <Feather
    //           name="grid"
    //           size={24}
    //           color={focused ? "#FF6C00" : "rgba(33, 33, 33, 0.8)"}
    //         />
    //       ),
    //     }}
    //     name="Posts"
    //     component={PostsScreen}
    //   />
    //   <HomeStack.Screen
    //     options={{
    //       tabBarIcon: ({ focused }) => (
    //         <MaterialIcons
    //           name="add"
    //           size={24}
    //           color={focused ? "#FF6C00" : "rgba(33, 33, 33, 0.8)"}
    //         />
    //       ),
    //       headerLeft: () => (
    //         <TouchableOpacity
    //           activeOpacity={0.8}
    //           style={styles.logOut}
    //           onPress={() => navigation.navigate("Posts")}
    //         >
    //           <AntDesign
    //             name="arrowleft"
    //             size={24}
    //             color="rgba(33, 33, 33, 0.8)"
    //           />
    //         </TouchableOpacity>
    //       ),
    //       tabBarStyle: { display: "none" },
    //     }}
    //     name="Create post"
    //     component={CreatePostsScreen}
    //   />
    //   <HomeStack.Screen
    //     options={{
    //       headerShown: false,
    //       tabBarIcon: ({ focused }) => (
    //         <Feather
    //           name="user"
    //           size={24}
    //           color={focused ? "#FF6C00" : "rgba(33, 33, 33, 0.8)"}
    //         />
    //       ),
    //     }}
    //     name="Profile"
    //     component={ProfileScreen}
    //   />
    //   <HomeStack.Screen
    //     options={{
    //       headerLeft: () => (
    //         <TouchableOpacity
    //           activeOpacity={0.8}
    //           style={styles.logOut}
    //           onPress={() => {
    //             path ? navigation.navigate(path) : navigation.navigate("Posts");
    //           }}
    //         >
    //           <AntDesign
    //             name="arrowleft"
    //             size={24}
    //             color="rgba(33, 33, 33, 0.8)"
    //           />
    //         </TouchableOpacity>
    //       ),
    //       tabBarButton: () => null,
    //       tabBarVisible: false,
    //       tabBarStyle: { display: "none" },
    //     }}
    //     name="Map"
    //     component={MapScreen}
    //   />
    //   <HomeStack.Screen
    //     options={{
    //       headerLeft: () => (
    //         <TouchableOpacity
    //           activeOpacity={0.8}
    //           style={styles.logOut}
    //           onPress={() => {
    //             path ? navigation.navigate(path) : navigation.navigate("Posts");
    //           }}
    //         >
    //           <AntDesign
    //             name="arrowleft"
    //             size={24}
    //             color="rgba(33, 33, 33, 0.8)"
    //           />
    //         </TouchableOpacity>
    //       ),
    //       tabBarButton: () => null,
    //       tabBarVisible: false,
    //       tabBarStyle: { display: "none" },
    //     }}
    //     name="Comments"
    //     component={CommentsScreen}
    //   />
    // </HomeStack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 85,
    paddingLeft: 80,
    paddingRight: 80,
  },
  tabIconWrapperStyle: {
    position: "absolute",
    top: 9,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 5,
    paddingBottom: 20,
  },
  tabIconStyle: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 23,
    paddingRight: 23,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 20,
  },
  // logOut: {
  //   padding: 10,
  // },
});

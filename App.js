import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import { useFonts } from "expo-font";
// import * as SplashScreen from "expo-splash-screen";

import RegisterScreen from "./screens/auth/RegistrationScreen";
import LoginScreen from "./screens/auth/LoginScreen";

// SplashScreen.preventAutoHideAsync();

const AuthStack = createNativeStackNavigator();

export default function App() {
  // const [fontsLoaded] = useFonts({
  //   "Montserrat-Regular": require("./assets/fonts/Montserrat-Regular.ttf"),
  // });

  // const onLayoutRootView = useCallback(async () => {
  //   if (fontsLoaded) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded]);

  // if (!fontsLoaded) {
  //   return null;
  // }

  return (
    <>
      <NavigationContainer>
        <AuthStack.Navigator>
          <AuthStack.Screen
            // onLayout={onLayoutRootView}
            options={{ headerShown: false }}
            name="Register"
            component={RegisterScreen}
          />
          <AuthStack.Screen
            // onLayout={onLayoutRootView}
            name="Login"
            options={{ headerShown: false }}
            component={LoginScreen}
          />
        </AuthStack.Navigator>
      </NavigationContainer>
    </>
  );
}

// import { StatusBar } from "expo-status-bar";
// import { StyleSheet, Text, View } from "react-native";

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <Text>This is my first React Native App!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fcfcfc",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

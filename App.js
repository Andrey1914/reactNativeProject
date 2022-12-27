import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import * as Font from "expo-font";

import AuthScreen from "./src/screens/AuthScreen/AuthScreen";

// import * as SplashScreen from "expo-splash-screen";

// SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          "Montserrat-Regular": require("./assets/fonts/Montserrat-Regular.ttf"),
          "Montserrat-Thin": require("./assets/fonts/Montserrat-Thin.ttf"),
          "Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf"),
        });
      } catch (error) {
        console.warn(error);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  return (
    <>
      {isReady && (
        <Provider store={store}>
          <NavigationContainer>
            <AuthScreen />
          </NavigationContainer>
        </Provider>
      )}
    </>
  );

  // const [fontsLoaded] = useFonts({
  //   "Montserrat-Regular": require("./assets/fonts/Montserrat-Regular.ttf"),
  //   "Montserrat-Thin": require("./assets/fonts/Montserrat-Thin.ttf"),
  //   "Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf"),
  // });

  // const onLayoutRootView = useCallback(async () => {
  //   if (fontsLoaded) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded]);
}

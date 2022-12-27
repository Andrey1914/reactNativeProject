import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { authStateChangeUser } from "../../redux/authOperations";

import LoginScreen from "./LoginScreen";
import RegistrationScreen from "./RegistrationScreen";
import HomeScreen from "../MainScreen/HomeScreen";

const AuthStack = createNativeStackNavigator();

export default function AuthScreen() {
  const { state } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authStateChangeUser());
  }, [state]);

  return (
    <AuthStack.Navigator>
      <>
        {!state ? (
          <>
            <AuthStack.Screen
              options={{ headerShown: false }}
              name="Login"
              component={LoginScreen}
            />
            <AuthStack.Screen
              options={{ headerShown: false }}
              name="Registration"
              component={RegistrationScreen}
            />
          </>
        ) : (
          <AuthStack.Screen
            options={{ headerShown: false }}
            name="Home"
            component={HomeScreen}
          />
        )}
      </>
    </AuthStack.Navigator>
  );
}

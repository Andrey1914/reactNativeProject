import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import Input from "../../components/Input";
import { authSignInUser } from "../../redux/authOperations";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";

const initialState = {
  email: "",
  password: "",
};

export default function LoginScreen({ navigation }) {
  const [state, setState] = useState(initialState);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsShowKeyboard(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsShowKeyboard(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    setState(initialState);
  };

  const submitForm = () => {
    keyboardHide();
    dispatch(authSignInUser(state));
  };

  const handleInput = (type, value) => {
    setState((prevState) => ({ ...prevState, [type]: value }));
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <ImageBackground
        source={require("../../../assets/images/bg-mountain.jpg")}
        style={styles.image}
      >
        <View
          style={{
            ...styles.form,
            paddingBottom: isShowKeyboard ? 30 : 110,
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
          >
            <Text style={styles.pageTitle}>Login</Text>
            <Input
              onFocus={() => setIsShowKeyboard(true)}
              value={state.email}
              onChangeText={(value) => handleInput("email", value)}
              placeholder="Email address"
            />
            <Input
              onFocus={() => setIsShowKeyboard(true)}
              value={state.password}
              onChangeText={(value) => handleInput("password", value)}
              placeholder="Password"
              password
            />
            {!isShowKeyboard && (
              <>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.formBtn}
                  onPress={submitForm}
                >
                  <Text style={styles.formBtnText}>Log In</Text>
                </TouchableOpacity>
                <View style={styles.authFooter}>
                  <Text style={styles.switchText}>Don't have an account? </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Registration")}
                  >
                    <Text style={styles.switchLink}> Sign Up</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  pageTitle: {
    fontFamily: "Montserrat-Regular",
    fontSize: 30,
    lineHeight: 35,
    marginBottom: 32,
    textAlign: "center",
    color: "#212121",
  },
  form: {
    position: "relative",
    paddingBottom: 78,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "#FFFFFF",
  },
  formBtn: {
    marginTop: 27,
    marginBottom: 16,
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#FF6C00",
    borderRadius: 100,
  },
  formBtnText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: "#FFFFFF",
  },
  authFooter: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  switchText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    lineHeight: 19,
  },
  switchLink: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: "#1B4371",
    textDecorationLine: "underline",
  },
});

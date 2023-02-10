import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  // Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ImageBackground,
} from "react-native";

import { authSignInUser } from "../../redux/authOperations";
import { useDispatch } from "react-redux";

const initialState = {
  email: "",
  password: "",
};

export default function LoginScreen({ navigation }) {
  // const [password, setPassword] = useState("");
  // const [email, setEmail] = useState("");
  const [state, setState] = useState(initialState);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [isSecureTextEntry, IsSecureTextEntry] = useState(true);

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

  const onSubmit = () => {
    keyboardHide();
    dispatch(authSignInUser(state));
    // setEmail("");
    // setPassword("");
  };

  const handleInput = (type, value) => {
    setState((prevState) => ({ ...prevState, [type]: value }));
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      {/* <View style={styles.container}> */}
      <ImageBackground
        style={styles.image}
        source={require("../../../assets/images/mountain.jpg")}
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
            <View
              style={{
                ...styles.formBackdrop,
                paddingHorizontal: 40,
              }}
            >
              <View style={styles.form}>
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>Log in</Text>
                </View>
                <View style={{ marginTop: 20 }}>
                  <Text style={styles.inputTitle}>Email address</Text>
                  <TextInput
                    style={styles.input}
                    value={state.email}
                    textAlign={"center"}
                    onFocus={() => setIsShowKeyboard(true)}
                    onChangeText={(value) => handleInput("email", value)}
                    placeholder="Email"
                    placeholderTextColor="#ccc"
                    keyboardType="email-address"
                  />
                </View>
                <View style={{ marginTop: 20 }}>
                  <Text style={styles.inputTitle}>Password</Text>
                  <TextInput
                    style={styles.input}
                    textAlign={"center"}
                    secureTextEntry={isSecureTextEntry}
                    onFocus={() => setIsShowKeyboard(true)}
                    value={state.password}
                    onChangeText={(value) => handleInput("password", value)}
                    placeholder="Password"
                    placeholderTextColor="#ccc"
                  />
                  <View style={styles.showPasswordBox}>
                    <Text
                      style={styles.text}
                      onPress={() => {
                        IsSecureTextEntry(!isSecureTextEntry);
                      }}
                    >
                      {isSecureTextEntry ? "Show password" : "Hide password"}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.btn}
                  onPress={onSubmit}
                >
                  <Text style={styles.btnTitle}>Sign in</Text>
                </TouchableOpacity>
                <View style={styles.loginView}>
                  <Text style={styles.loginText}>No account?</Text>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Registration")}
                  style={styles.btnTrans}
                >
                  <Text style={styles.btnTransTitle}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
      {/* </View> */}
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  form: {
    marginHorizontal: 16,
  },
  formBackdrop: {
    // backgroundColor: "transparent",
    // justifyContent: "flex-end",
    position: "relative",
    paddingBottom: 78,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "#FFFFFF",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    height: 40,
    borderRadius: 8,
    color: "#ccc",
  },
  inputTitle: {
    fontFamily: "Montserrat-Regular",
    color: "#ccc",
    fontSize: 16,
    marginBottom: 8,
  },
  btn: {
    borderRadius: 6,
    borderWidth: 1,
    height: 40,
    marginTop: 40,
    justifyContent: "center",
    marginHorizontal: 20,
    alignItems: "center",
    ...Platform.select({
      ios: {
        backgroundColor: "transparent",
        borderColor: "#f0f8ff",
      },
      android: {
        backgroundColor: "#4169e1",
        borderColor: "transparent",
      },
    }),
  },
  btnTitle: {
    color: Platform.OS === "ios" ? "#4169e1" : "#f0f8ff",
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
  },
  header: {
    marginBottom: 33,
  },
  headerTitle: {
    fontFamily: "Montserrat-Regular",
    // fontFamily: "Montserrat-Bold",
    textAlign: "center",
    fontSize: 32,
    color: "#ccc",
  },
  loginView: {
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    color: "#fff",
    textAlign: "center",
  },
  btnTrans: {
    marginTop: 20,
    marginHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#4169e1",
  },
  btnTransTitle: {
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
    color: "#f0f8ff",
  },
});

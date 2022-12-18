import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ImageBackground,
} from "react-native";

const initialState = {
  nickname: "",
  email: "",
  password: "",
};

export default function RegisterScreen({ navigation }) {
  console.log(Platform.OS);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setstate] = useState(initialState);

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    console.log(state);
    setstate(initialState);
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <ImageBackground
          style={styles.image}
          source={require("../../assets/images/mountain.jpg")}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
          >
            <View
              style={{
                paddingHorizontal: 40,
              }}
            >
              <View
                style={{
                  // marginTop: 20,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <Text style={styles.headerTitle}>Hello! Sign up, please.</Text>
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={styles.inputTitle}>Nickname</Text>
                <TextInput
                  style={styles.input}
                  textAlign={"center"}
                  onFocus={() => setIsShowKeyboard(true)}
                  value={state.email}
                  onChangeText={(value) =>
                    setstate((prevState) => ({ ...prevState, nickname: value }))
                  }
                />
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={styles.inputTitle}>Email addres</Text>
                <TextInput
                  style={styles.input}
                  textAlign={"center"}
                  onFocus={() => setIsShowKeyboard(true)}
                  value={state.email}
                  onChangeText={(value) =>
                    setstate((prevState) => ({ ...prevState, email: value }))
                  }
                />
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={styles.inputTitle}>Password</Text>
                <TextInput
                  style={styles.input}
                  textAlign={"center"}
                  secureTextEntry={true}
                  onFocus={() => setIsShowKeyboard(true)}
                  value={state.password}
                  onChangeText={(value) =>
                    setstate((prevState) => ({ ...prevState, password: value }))
                  }
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.btn}
                onPress={keyboardHide}
                // onPress={() => navigation.navigate("HomeScreen")}
              >
                <Text style={styles.btnTitle}>Sign up</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={styles.btnTrans}
              >
                <Text style={styles.btnTransTitle}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    height: 40,
    borderRadius: 8,
    color: "#ccc",
  },
  inputTitle: {
    color: "#ccc",
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    marginBottom: 8,
  },
  btn: {
    borderRadius: 6,
    borderWidth: 1,
    height: 40,
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
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
  headerTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 32,
    textAlign: "center",
    color: "#ccc",
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

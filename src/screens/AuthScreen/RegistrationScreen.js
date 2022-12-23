import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";

import { storage } from "../../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { useDispatch } from "react-redux";
import { authSlice } from "../../redux/authReducer";
import { authSignUpUser, updateAvatar } from "../../redux/authOperations";

import {
  StyleSheet,
  Image,
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
import Svg, { Circle, Path } from "react-native-svg";

export default function RegistrationScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [isSecureTextEntry, IsSecureTextEntry] = useState(true);
  const [avatar, setAvatar] = useState(null);

  const dispatch = useDispatch();

  const uploadPhotoToServer = async (avatarId) => {
    try {
      const response = await fetch(avatar);
      const file = await response.blob();
      const storageRef = ref(storage, `avatars/${avatarId}`);
      await uploadBytes(storageRef, file);
      const path = await getDownloadURL(ref(storage, `avatar/${avatarId}`));
      setAvatar(path);
    } catch (error) {
      console.log(error);
    }
  };

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const onSubmit = async () => {
    try {
      const updatedUser = await authSignUpUser({
        email,
        login,
        password,
      });
      await uploadPhotoToServer(updatedUser.uid);
      dispatch(updateAvatar(avatar));
      dispatch(
        authSlice.actions.updateProfile({
          userId: updatedUser,
          login: updatedUser.displayName,
          email: updatedUser.email,
        })
      );
      keyboardHide();
      setEmail("");
      setPassword("");
      setLogin("");
    } catch {
      console.log(error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.uri);
    }
  };

  useEffect(() => {
    const hideKeyboard = Keyboard.addListener("keyboardDidHide", () => {
      setIsShowKeyboard(false);
    });

    return () => {
      hideKeyboard.remove();
    };
  }, []);

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
                ...styles.formBackdrop,
                paddingHorizontal: 40,
              }}
            >
              <View style={styles.centerBox}>
                <View style={styles.avatarBox}>
                  <Image
                    style={{ height: "100%", width: "100%", borderRadius: 16 }}
                    source={{ uri: avatar }}
                  ></Image>
                  <TouchableOpacity
                    style={styles.addIconBox}
                    onPress={pickImage}
                  >
                    <Svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="none"
                      viewBox="0 0 25 25"
                    >
                      <Circle
                        cx="12.5"
                        cy="12.5"
                        r="12"
                        fill="none"
                        stroke="#FF6C00"
                      ></Circle>
                      <Path
                        fill="#FF6C00"
                        fillRule="evenodd"
                        d="M13 6h-1v6H6v1h6v6h1v-6h6v-1h-6V6z"
                        clipRule="evenodd"
                      ></Path>
                    </Svg>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  ...styles.form,
                  // marginTop: 20,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>
                    Hello! Sign up, please.
                  </Text>
                </View>
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={styles.inputTitle}>Nickname</Text>
                <TextInput
                  style={styles.input}
                  textAlign={"center"}
                  onFocus={() => setIsShowKeyboard(true)}
                  value={login}
                  onChangeText={setLogin}
                  placeholder="Login"
                  placeholderTextColor="#ccc"
                />
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={styles.inputTitle}>Email addres</Text>
                <TextInput
                  style={styles.input}
                  textAlign={"center"}
                  onFocus={() => setIsShowKeyboard(true)}
                  value={email}
                  onChangeText={setEmail}
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
                  value={password}
                  onChangeText={setPassword}
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
                <Text style={styles.btnTitle}>Sign up</Text>
              </TouchableOpacity>
              <View style={styles.enterAccountView}>
                <Text style={styles.enterAccountText}>
                  Do you have an account?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Login")}
                  style={styles.btnTrans}
                >
                  <Text style={styles.btnTransTitle}>Sign in</Text>
                </TouchableOpacity>
              </View>
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
  form: { marginHorizontal: 16 },
  formBackdrop: {
    backgroundColor: "#121212",
    justifyContent: "flex-end",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
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
  header: {
    marginBottom: 33,
  },
  headerTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 32,
    textAlign: "center",
    color: "#ccc",
  },
  avatarBox: {
    height: 120,
    width: 120,
    borderRadius: 16,
    backgroundColor: "#515151",
    borderColor: "#fff",
    borderWidth: 1,
  },
  centerBox: {
    position: "absolute",
    left: 0,
    right: 0,
    top: -60,
    alignItems: "center",
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
  addIconBox: {
    position: "absolute",
    right: -13,
    bottom: 14,
  },
  showPasswordBox: {
    position: "absolute",
    bottom: 15,
    right: 16,
  },
  enterAccountView: {
    flexDirection: "row",
    justifyContent: "center",
  },
  enterAccountText: {
    color: "#fff",
    fontFamily: "DMMono-Medium",
    textAlign: "center",
  },
});

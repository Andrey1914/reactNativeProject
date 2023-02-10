import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";

// import { storage } from "../../firebase/config";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { useDispatch } from "react-redux";
// import { authSlice } from "../../redux/authReducer";
// import { authSignUpUser, updateAvatar } from "../../redux/authOperations";
import { authSignUpUser } from "../../redux/authOperations";
import {
  StyleSheet,
  Image,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  // Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ImageBackground,
  Alert,
} from "react-native";

import { AntDesign, Ionicons } from "@expo/vector-icons";

const initialState = {
  name: "",
  email: "",
  password: "",
  avatar: "",
};

export default function RegistrationScreen({ navigation }) {
  const [state, setState] = useState(initialState);
  // const [email, setEmail] = useState("");
  // const [login, setLogin] = useState("");
  // const [password, setPassword] = useState("");
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [isSecureTextEntry, IsSecureTextEntry] = useState(true);
  const [avatarUpload, setAvatarUpload] = useState("");

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

  // upload avatar from gallery
  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,

      quality: 0,
    });

    if (!result.canceled) {
      // setAvatar(result.assets);
      setAvatarUpload(result.assets[0].uri);
    }
  };

  // delete avatar
  const deleteAvatar = () => {
    setAvatarUpload(null);
  };

  // upload avatar to firebase
  const uploadAvatarToServer = async () => {
    const storage = getStorage();
    const uniqueAvatarId = Date.now().toString();
    const storageRef = ref(storage, `avatars/${uniqueAvatarId}`);

    const response = await fetch(avatarUpload);
    const file = await response.blob();

    await uploadBytes(storageRef, file).then(() => {});

    const processedPhoto = await getDownloadURL(
      ref(storage, `avatars/${uniqueAvatarId}`)
    )
      .then((url) => {
        return url;
      })
      .catch((error) => {
        console.log(error);
      });

    return processedPhoto;
  };

  // sending the registration form to firebase

  const onSubmit = async () => {
    try {
      const avatarRef = await uploadAvatarToServer();
      setState((prevState) => ({ ...prevState, avatar: avatarRef }));
      const newState = {
        avatar: avatarRef,
        name: state.name,
        email: state.email,
        password: state.password,
      };

      dispatch(authSignUpUser(newState));
      keyboardHide();
      // const updatedUser = await authSignUpUser({
      //   email,
      //   login,
      //   password,
      // });
      // await uploadPhotoToServer(updatedUser.uid);
      // dispatch(updateAvatar(avatar));
      // dispatch(
      //   authSlice.actions.updateProfile({
      //     userId: updatedUser,
      //     login: updatedUser.displayName,
      //     email: updatedUser.email,
      //   })
      // );
      // keyboardHide();
      // setEmail("");
      // setPassword("");
      // setLogin("");
    } catch (error) {
      // console.log(error);
      Alert.alert("Choose your avatar");
    }
  };

  const handleInput = (type, value) => {
    setState((prevState) => ({ ...prevState, [type]: value }));
  };

  // useEffect(() => {
  //   const hideKeyboard = Keyboard.addListener("keyboardDidHide", () => {
  //     setIsShowKeyboard(false);
  //   });

  //   return () => {
  //     hideKeyboard.remove();
  //   };
  // }, []);

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <ImageBackground
          style={styles.image}
          source={require("../../../assets/images/mountain.jpg")}
        >
          <View
            style={{
              ...styles.form,
              paddingBottom: isShowKeyboard ? 30 : 45,
            }}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS == "ios" ? "padding" : "height"}
            >
              {/* <View
              style={{
                ...styles.formBackdrop,
                paddingHorizontal: 40,
              }}
            > */}
              <View style={styles.centerBox}>
                <View style={styles.avatarBox}>
                  <View style={{ overflow: "hidden", borderRadius: 16 }}>
                    <ImageBackground
                      style={styles.avatar}
                      source={require("../../../assets/images/drops-pink.jpg")}
                    >
                      {avatarUpload && (
                        <Image
                          style={styles.avatar}
                          source={{ uri: avatarUpload }}
                        />
                      )}
                    </ImageBackground>
                  </View>
                  {/* // ></Image> */}
                  {avatarUpload ? (
                    <TouchableOpacity
                      style={{ ...styles.avatarBtn, borderColor: "#BDBDBD" }}
                      onPress={deleteAvatar}
                    >
                      {/* <MaterialIcons name="close" size={26} color="#BDBDBD" /> */}
                      <AntDesign
                        name="closecircleo"
                        size={26}
                        color="#BDBDBD"
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.addIconBox}
                      onPress={pickAvatar}
                    >
                      <Ionicons
                        name="add-circle-outline"
                        size={26}
                        color="#FF6C00"
                      />
                    </TouchableOpacity>
                  )}
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
                    {/* Hello! Sign up, please. */}
                    Registration.
                  </Text>
                </View>
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={styles.inputTitle}>Nickname</Text>
                <TextInput
                  style={styles.input}
                  textAlign={"center"}
                  onFocus={() => setIsShowKeyboard(true)}
                  // value={login}
                  onChangeText={(value) => handleInput("name", value)}
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
                  // value={email}
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
                  // value={password}
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
                <Text style={styles.btnTitle}>Sign up</Text>
              </TouchableOpacity>
              <View style={styles.enterAccountView}>
                <Text style={styles.enterAccountText}>
                  Do you have an account?{" "}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={styles.btnTrans}
              >
                <Text style={styles.btnTransTitle}>Sign in</Text>
              </TouchableOpacity>
              {/* </View> */}
            </KeyboardAvoidingView>
          </View>
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
    // backgroundColor: "transparent",
    // justifyContent: "flex-end",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
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
    fontFamily: "Montserrat-Regular",
    // fontFamily: "Montserrat-Bold",
    fontSize: 32,
    textAlign: "center",
    color: "#ccc",
  },
  avatar: {
    width: 120,
    height: 120,
    resizeMode: "cover",
  },
  avatarBox: {
    height: 120,
    width: 120,

    borderRadius: 16,
    backgroundColor: "transparent",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  avatarBtn: {
    position: "absolute",
    bottom: 20,
    right: -15,
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#FF6C00",
    borderRadius: 50,
  },
  centerBox: {
    position: "absolute",
    left: 0,
    right: 0,
    top: -30,
    alignItems: "center",
  },
  btnTrans: {
    borderRadius: 6,
    borderWidth: 1,
    height: 40,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
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
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },
});

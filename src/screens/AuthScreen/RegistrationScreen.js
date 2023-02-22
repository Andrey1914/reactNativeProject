import { useState, useEffect } from "react";
import Input from "../../components/Input";
import { useDispatch } from "react-redux";
import { authSignUpUser } from "../../redux/authOperations";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ImageBackground,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

const initialState = {
  name: "",
  email: "",
  password: "",
  avatar: "",
};

export default function RegistrationScreen({ navigation }) {
  const [state, setState] = useState(initialState);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
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

  //завантаження аватара з галереї телефона
  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatarUpload(result.assets[0].uri);
    }
  };

  //видалення аватара
  const deleteAvatar = async () => {
    setAvatarUpload(null);
  };

  //відправка форми регистрації на farebase
  const submitForm = async () => {
    try {
      const photoURL = await uploadAvatarToServer();
      setState((prevState) => ({ ...prevState, avatar: photoURL }));
      const newState = {
        avatar: photoURL,
        name: state.name,
        email: state.email,
        password: state.password,
      };
      dispatch(authSignUpUser(newState));
      keyboardHide();
    } catch (error) {
      Alert.alert("Something went wrong :(");
    }
  };

  //відправка avatar на farebase
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

  const handleInput = (type, value) => {
    setState((prevState) => ({ ...prevState, [type]: value }));
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <ImageBackground
          source={require("../../../assets/images/bg-mountain.jpg")}
          style={styles.image}
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
              <View style={styles.avatarWrapper}>
                <View style={{ overflow: "hidden", borderRadius: 16 }}>
                  <ImageBackground
                    style={styles.avatar}
                    source={require("../../../assets/images/default-avatar.png")}
                  >
                    {avatarUpload && (
                      <Image
                        style={styles.avatar}
                        source={{ uri: avatarUpload }}
                      />
                    )}
                  </ImageBackground>
                </View>
                {avatarUpload ? (
                  <TouchableOpacity
                    style={{ ...styles.avatarBtn, borderColor: "#BDBDBD" }}
                    onPress={deleteAvatar}
                  >
                    <MaterialIcons name="close" size={26} color="#BDBDBD" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.avatarBtn}
                    onPress={pickAvatar}
                  >
                    <MaterialIcons name="add" size={26} color="#FF6C00" />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.pageTitle}>Registration</Text>
              <Input
                onFocus={() => setIsShowKeyboard(true)}
                value={state.name}
                onChangeText={(value) => handleInput("name", value)}
                placeholder="Name"
              />
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
                    <Text style={styles.formBtnText}>Sign Up</Text>
                  </TouchableOpacity>

                  <View style={styles.authFooter}>
                    <Text style={styles.switchText}>
                      Already have an account?{" "}
                    </Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Login")}
                    >
                      <Text style={styles.switchLink}> Log In</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
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
    backgroundColor: "#fffff0",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  avatarWrapper: {
    position: "absolute",
    alignSelf: "center",
    top: -80,
  },
  avatar: {
    width: 120,
    height: 120,
    resizeMode: "cover",
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
  pageTitle: {
    fontFamily: "Montserrat-Regular",
    fontSize: 30,
    lineHeight: 35,
    marginBottom: 32,
    marginTop: 50,
    textAlign: "center",
    color: "#212121",
  },
  form: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
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

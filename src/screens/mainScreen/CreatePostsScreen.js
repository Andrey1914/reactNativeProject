import { useEffect, useState } from "react";
import uuid from "react-native-uuid";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";

import { storage, db } from "../../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { Camera } from "expo-camera";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";

import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

export default function CreatePostsScreen({ navigation }) {
  const [isShownKeyboard, setIsShownKeyboard] = useState(false);
  const [camera, setCamera] = useState(null);
  const [photoPath, setPhotoPath] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [loading, setLoading] = useState(false);

  const { userId, login } = useSelector((state) => state.auth);

  useEffect(() => {
    const hideKeyboard = Keyboard.addListener("keyboardDidHide", () => {
      setIsShownKeyboard(false);
    });

    return () => {
      hideKeyboard.remove();
    };
  }, []);

  const takePhoto = async () => {
    if (!camera) {
      console.log("error");
      return;
    }

    try {
      const { status } = await Camera.getCameraPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access camera was denied");
        return;
      }
      const photo = await camera.takePictureAsync();
      setPhotoPath(photo.uri);
    } catch (error) {
      console.log(error.message);
    }
  };

  const uploadPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoPath(result.assets);
    }
  };

  const uploadPhotoToServer = async () => {
    try {
      const postId = uuid.v4().split("-").join("");
      const response = await fetch(photoPath);
      const file = await response.blob();
      const storageRef = await ref(storage, `posts/${postId}`);
      await uploadBytesResumable(storageRef, file);
      const photo = await getDownloadURL(storageRef);
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync();

      return { photo, location };
    } catch (error) {
      console.log(error);
    }
  };

  const createPost = async () => {
    try {
      const { photo, location } = await uploadPhotoToServer();
      await addDoc(collection(db, "posts"), {
        photo,
        name: photoName,
        locationName,
        location,
        userId,
        login,
        comments: 0,
        likes: [],
      });
    } catch (error) {
      console.log("Error adding document: ", error);
    }
  };

  const keyboardHide = () => {
    setIsShownKeyboard(false);
    Keyboard.dismiss();
  };

  const reset = () => {
    setLocationName("");
    setPhotoName("");
    setPhotoPath("");
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      await createPost();
      reset();

      setLoading(false);
      navigation.navigate("Posts");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View
        style={{
          ...styles.container,
          justifyContent: isShownKeyboard ? "flex-end" : "space-between",
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View
            style={{
              ...styles.form,
              marginBottom: Platform.OS === "ios" && isShownKeyboard ? 80 : 20,
            }}
          >
            <View style={styles.addPhotoContainer}>
              <Camera style={styles.addPhotoBox} ref={setCamera}>
                <TouchableOpacity style={styles.photoIcon} onPress={takePhoto}>
                  <MaterialIcons
                    name="photo-camera"
                    size={24}
                    color="#121212"
                  />
                </TouchableOpacity>
                {photoPath && (
                  <Image
                    source={{ uri: photoPath }}
                    style={styles.sampleImg}
                  ></Image>
                )}
              </Camera>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.addPhoto}
                onPress={() => uploadPhoto()}
              >
                <Text style={styles.upLoadPhotoText}>Upload photo</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 20 }}>
              <View style={{ marginTop: 20 }}>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  placeholderTextColor="#ccc"
                  onFocus={() => setIsShownKeyboard(true)}
                  onChangeText={setPhotoName}
                  value={photoName}
                ></TextInput>
              </View>

              <View>
                <TextInput
                  style={{ ...styles.input, paddingLeft: 36 }}
                  placeholder="Location"
                  placeholderTextColor="#ccc"
                  onFocus={() => setIsShownKeyboard(true)}
                  onChangeText={setLocationName}
                  value={locationName}
                ></TextInput>

                <Ionicons
                  name="location-outline"
                  size={24}
                  color="#ccc"
                  style={styles.locationIcon}
                />
              </View>

              <TouchableOpacity
                style={{
                  ...styles.button,
                  display: isShownKeyboard ? "none" : "flex",
                  backgroundColor: !(photoPath && photoName && locationName)
                    ? "#4169e1"
                    : "#fff",
                }}
                disabled={!(photoPath && photoName && locationName) || loading}
                onPress={onSubmit}
              >
                <View style={styles.textButton}>
                  {loading ? (
                    <ActivityIndicator />
                  ) : (
                    <Text
                      style={{
                        ...styles.btnText,
                        color: !(photoPath && photoName && locationName)
                          ? "#f0f8ff"
                          : "#000",
                      }}
                    >
                      Post
                    </Text>
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton} onPress={reset}>
                <View
                  style={{
                    ...styles.deleteButtonBox,
                    display: isShownKeyboard ? "none" : "flex",
                  }}
                >
                  <AntDesign name="delete" size={24} color="#f0f8ff" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontFamily: "Montserrat-Regular",
    fontSize: 32,
  },
  form: {
    marginHorizontal: 16,
    marginTop: 32,
  },
  addPhotoBox: {
    position: "relative",
    height: 240,
    borderRadius: 8,
    backgroundColor: "#515151",
    justifyContent: "center",
    alignItems: "center",
  },
  photoIcon: {
    backgroundColor: "#fff",
    height: 60,
    width: 60,
    borderRadius: 30,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  sampleImg: {
    position: "absolute",
    left: 0,
    bottom: 0,
    height: 80,
    width: "33%",
    zIndex: 1,
  },
  addPhoto: { marginTop: 8 },
  upLoadPhotoText: {
    fontFamily: "Montserrat-Regular",
    color: "#ccc",
    fontSize: 16,
    textAlign: "center",
  },
  input: {
    color: "#000",
    padding: 5,
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    height: 40,
    paddingLeft: 16,
    marginBottom: 16,
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
  },
  button: {
    height: 40,
    borderRadius: 5,
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 16,
  },
  textButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    textAlign: "center",
    fontFamily: "Montserrat-Regular",
    fontSize: 18,
  },
  locationIcon: {
    position: "absolute",
    left: 8,
    top: 7,
  },
  deleteButtonBox: {
    alignItems: "center",
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    // width: 60,
    height: 40,
    backgroundColor: "#4169e1",
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 36,
  },
});

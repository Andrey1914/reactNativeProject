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

import { storage, db, firebase } from "../../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { Camera } from "expo-camera";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";

import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

export default function CreatePostsScreen({ navigation }) {
  const [isShownKeyboard, setIsShownKeyboard] = useState(false);

  const [snap, setSnap] = useState(null);
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

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();

      console.log(status);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      console.log(status);
    })();
  }, []);

  const takePhoto = async () => {
    if (!snap) {
      console.log("error");
      return;
    }
    try {
      const { status } = await Camera.getCameraPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission to access camera was denied");
        return;
      }

      const photo = await snap.takePictureAsync();
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
      const storageRef = ref(storage, `image/${postId}`);

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

      navigation.navigate("Posts", { photo, location });
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
              <Camera style={styles.addPhotoBox} ref={setSnap}>
                <TouchableOpacity style={styles.photoIcon} onPress={takePhoto}>
                  <MaterialIcons name="photo-camera" size={24} color="#fff" />
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

            <View>
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Name..."
                  placeholderTextColor="#BDBDBD"
                  onFocus={() => setIsShownKeyboard(true)}
                  onChangeText={setPhotoName}
                  value={photoName}
                ></TextInput>
              </View>

              <View>
                <TextInput
                  style={{ ...styles.input, paddingLeft: 28 }}
                  placeholder="Location..."
                  placeholderTextColor="#BDBDBD"
                  onFocus={() => setIsShownKeyboard(true)}
                  onChangeText={setLocationName}
                  value={locationName}
                ></TextInput>
                <Feather
                  name="map-pin"
                  size={24}
                  color="#BDBDBD"
                  style={styles.locationIcon}
                />
              </View>

              <TouchableOpacity
                style={{
                  ...styles.button,
                  display: isShownKeyboard ? "none" : "flex",
                  backgroundColor: !(photoPath && photoName && locationName)
                    ? "#FF6C00"
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
                  <Feather name="trash-2" size={24} color="#BDBDBD" />
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
  },
  addPhotoContainer: {
    borderRadius: 16,
    backgroundColor: "ccc",
    marginBottom: 32,
    marginTop: 32,
  },
  addPhotoBox: {
    position: "relative",
    height: 240,
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
    border: "1px solid #E8E8E8",
    justifyContent: "center",
    alignItems: "center",
  },
  photoIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    height: 60,
    width: 60,
    borderRadius: 30,
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
    textAlign: "left",
  },
  input: {
    color: "#000",
    borderColor: "#E8E8E8",
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 16,
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
  },
  button: {
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    marginTop: 16,
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
    left: 0,
    top: 7,
  },
  deleteButtonBox: {
    alignItems: "center",
  },
  deleteButton: {
    width: 70,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 100,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
    marginBottom: 36,
  },
});

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
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

export default function CreatePostsScreen({ navigation }) {
  const [isShownKeyboard, setIsShownKeyboard] = useState(false);

  // const [image, setImage] = useState(null);
  // const [uploading, setUploading] = useState(false);
  const [snap, setSnap] = useState(null);
  const [photoPath, setPhotoPath] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [loading, setLoading] = useState(false);
  // const [location, setLocation] = useState(null);

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
      // setImage(snapshot.uri);
      // console.log(snapshot.uri);
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
      // console.log(result.assets);
    }
  };

  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   console.log(result);

  //   if (!result.canceled) {
  //     setImage(result.assets);
  //   }
  // };

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

  // const uploadImage = async () => {
  //   const postId = uuid.v4().split("-").join("");
  //   const blob = await new Promise((resolve, reject) => {
  //     const xhr = new XMLHttpRequest();
  //     xhr.onload = function () {
  //       resolve(xhr.response);
  //     };
  //     xhr.onerror = function () {
  //       reject(new TypeError("Network request failed"));
  //     };
  //     xhr.responseType = "blob";
  //     xhr.open("GET", image, true);
  //     xhr.send(null);
  //   });
  //   const ref = firebase.storage().ref().child(`posts/${postId}`);
  //   const snapshot = ref.put(blob);
  //   snapshot.on(
  //     firebase.storage.TaskEvent.STATE_CHANGED,
  //     () => {
  //       setUploading(true);
  //     },
  //     (error) => {
  //       setUploading(false);
  //       console.log(error);
  //       blob.close();
  //       return;
  //     },
  //     () => {
  //       snapshot.snapshot.ref.getDownloadURL().then((url) => {
  //         setUploading(false);
  //         console.log("Download URL: ", url);
  //         setImage(url);
  //         blob.close();
  //         return url;
  //       });
  //     }
  //   );
  // };

  const createPost = async () => {
    try {
      const { photo, location } = await uploadPhotoToServer();
      // const snapshot = await uploadImage();
      // console.log(photo);
      // console.log(location);
      await addDoc(collection(db, "posts"), {
        photo,
        // snapshot,
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
    // setImage(null);
  };

  const onSubmit = async () => {
    // console.log("navigation", navigation);
    try {
      setLoading(true);
      // setUploading(true);
      await createPost();
      reset();

      setLoading(false);
      // setUploading(false);
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
                // onPress={() => pickImage()}
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
                // onPress={uploadImage}
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

import { useEffect, useState } from "react";
import uuid from "react-native-uuid";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  // KeyboardAvoidingView,
  // Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  // ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";

import { db } from "../../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";

import { MaterialIcons } from "@expo/vector-icons";
// import { Feather } from "@expo/vector-icons";
import { Octicons, Feather } from "@expo/vector-icons";

const initialPostData = {
  photo: "",
  description: "",
  place: "",
};

export default function CreatePostsScreen({ navigation }) {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [postData, setPostData] = useState(initialPostData);
  const [snap, setSnap] = useState(null);
  // const [camera, setCamera] = useState(null);
  const [city, setCity] = useState("");
  const [location, setLocation] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [photoPath, setPhotoPath] = useState("");
  // const [photoName, setPhotoName] = useState("");
  // const [locationName, setLocationName] = useState("");
  // const [loading, setLoading] = useState(false);

  const { userId, name, email, avatar } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   const hideKeyboard = Keyboard.addListener("keyboardDidHide", () => {
  //     setIsShownKeyboard(false);
  //   });

  //   return () => {
  //     hideKeyboard.remove();
  //   };
  // }, []);

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
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access camera was denied");
        return;
      }
      // console.log(status);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
      }
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
      // await MediaLibrary.createAssetAsync(photo.uri);
      setImageToPostData(photo);
      setPhotoPath(photo.uri);
    } catch (error) {
      console.log(error.message);
    }
  };

  // upload photo from gallery
  // const uploadPhoto = async () => {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoPath(result.assets);
      setImageToPostData(result.assets[0].uri);
    }
  };

  const setImageToPostData = async (img) => {
    try {
      let location = await Location.getCurrentPositionAsync({});

      let coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      let address = await Location.reverseGeocodeAsync(coords);
      let city = address[0].city;
      setPostData((prevState) => ({ ...prevState, photo: img.uri || img }));
      setLocation(location);
      setCity(city);
    } catch (error) {
      console.log(error);
    }
  };
  const retakePhoto = () => {
    setPostData((prevState) => ({ ...prevState, photo: "" }));
  };

  const toggleCameraType = () => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const handleInput = (type, value) => {
    setPostData((prevState) => ({ ...prevState, [type]: value }));
  };

  const uploadPhotoToServer = async () => {
    try {
      const uniquePostId = uuid.v4().split("-").join("");

      const response = await fetch(photoPath);

      const file = await response.blob();
      const storageRef = ref(storage, `image/${uniquePostId}`);

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
  // const uploadPhotoToServer = async () => {
  //   const storage = getStorage();
  //   const uniquePostId = Date.now().toString();
  //   const storageRef = ref(storage, `images/${uniquePostId}`);

  //   const response = await fetch(postData.photo);
  //   const file = await response.blob();

  //   await uploadBytes(storageRef, file).then(() => {
  //     console.log(`photo is uploaded`);
  //   });
  //   const processedPhoto = await getDownloadURL(
  //     ref(storage, `images/${uniquePostId}`)
  //   )
  //     .then((url) => {
  //       return url;
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  //   return processedPhoto;
  // };

  // const createPost = async () => {
  //   try {
  //     const { photo, location } = await uploadPhotoToServer();

  //     await addDoc(collection(db, "posts"), {
  //       photo,

  //       name: photoName,
  //       locationName,
  //       location,
  //       userId,
  //       login,
  //       comments: 0,
  //       likes: [],
  //     });
  //   } catch (error) {
  //     console.log("Error adding document: ", error);
  //   }
  // };
  const uploadPostToServer = async () => {
    const photo = await uploadPhotoToServer();
    try {
      // const setUserPost = await addDoc(collection(db, "posts"), {
      await addDoc(collection(db, "posts"), {
        photo,
        description: postData.description,
        place: postData.place,
        location: location.coords,
        city,
        userId,
        name,
        email,
        avatar,
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // const reset = () => {
  //   setLocationName("");
  //   setPhotoName("");
  //   setPhotoPath("");
  // };

  // const onSubmit = async () => {
  //   try {
  //     setLoading(true);

  //     await createPost();
  //     reset();

  //     setLoading(false);

  //     navigation.navigate("Posts", { photo, location });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const sendPost = () => {
    uploadPostToServer();
    navigation.navigate("DefaultPost");
    setPostData(initialPostData);
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <View style={styles.header} />
        <View style={{ flex: 1 }}>
          {postData.photo ? (
            <View
              style={{
                ...styles.photoContainer,
              }}
            >
              <TouchableOpacity
                style={styles.retakePhotoBtn}
                onPress={retakePhoto}
              >
                <Octicons name="x" size={45} color="#F6F6F6" />
              </TouchableOpacity>
              <Image style={styles.photo} source={{ uri: postData.photo }} />
            </View>
          ) : (
            <Camera
              style={styles.camera}
              type={type}
              flashMode="auto"
              // ref={(ref) => setCamera(ref)}
              ref={setSnap}
            >
              <TouchableOpacity
                style={styles.cameraTypeBtn}
                onPress={toggleCameraType}
              >
                <Octicons name="sync" size={30} color="#F6F6F6" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cameraSnapBtn}
                onPress={takePhoto}
              >
                <MaterialIcons name="photo-camera" size={24} color="#fff" />
                {/* <Octicons name="issue-opened" size={50} color="#F6F6F6" /> */}
              </TouchableOpacity>
            </Camera>
          )}
          <TouchableOpacity style={styles.pickImgBtn} onPress={pickImage}>
            <Text
              style={{
                ...styles.btnTitle,
                color: "#ffffff",
              }}
            >
              Upload photo with gallery
            </Text>
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput
              style={{ ...styles.input, marginBottom: 16 }}
              placeholder="Enter a title..."
              onFocus={() => setIsShowKeyboard(true)}
              value={postData.description}
              onChangeText={(value) => handleInput("description", value)}
            />
            <TextInput
              style={{ ...styles.input, paddingLeft: 28 }}
              placeholder="Select a location..."
              onFocus={() => setIsShowKeyboard(true)}
              value={postData.place}
              onChangeText={(value) => handleInput("place", value)}
            />
            <Octicons
              name="location"
              size={24}
              style={{
                position: "absolute",
                top: 70,
                left: 16,
                color: "#CECDCD",
              }}
            />
          </View>
          <View>
            <TouchableOpacity
              style={{
                ...styles.sendBtn,
                backgroundColor: postData.photo ? "#FF6C00" : "#F6F6F6",
              }}
              disabled={!postData.photo}
              activeOpacity={0.7}
              onPress={sendPost}
            >
              <Text
                style={{
                  ...styles.btnTitle,
                  color: postData.photo ? "#fff" : "#BDBDBD",
                }}
              >
                Publish new post
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#BDBDBD",
  },
  camera: {
    position: "relative",
    height: "33%",
    marginTop: 32,
    marginHorizontal: 16,
    borderRadius: 8,
    // justifyContent: "flex-end",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 35,
  },
  cameraTypeBtn: {
    position: "absolute",
    top: 10,
    right: 13,
    opacity: 0.7,
  },
  cameraSnapBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    // marginBottom: 20,
    // opacity: 0.7,
  },
  photoContainer: {
    position: "relative",
    marginHorizontal: 16,
    height: 240,
    marginTop: 32,
  },
  photo: {
    position: "relative",
    height: "100%",
    borderRadius: 8,
    resizeMode: "cover",
  },
  retakePhotoBtn: {
    position: "absolute",
    top: 2,
    right: 11,
    opacity: 0.7,
    zIndex: 1,
  },
  inputWrapper: {
    position: "relative",
    marginTop: 22,
  },
  input: {
    height: 45,
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: "#212121",
  },
  pickImgBtn: {
    marginTop: 18,
    marginHorizontal: 16,
    padding: 10,
    backgroundColor: "#BDBDBD",
    alignItems: "center",
    borderRadius: 100,
  },
  sendBtn: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 16,
    marginTop: 32,
    borderRadius: 100,
  },
  btnTitle: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
  },
});

//   return (
//     <TouchableWithoutFeedback onPress={keyboardHide}>
//       <View
//         style={{
//           ...styles.container,
//           justifyContent: isShowKeyboard ? "flex-end" : "space-between",
//         }}
//       >
//         <KeyboardAvoidingView
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//         >
//           <View
//             style={{
//               ...styles.form,
//               marginBottom: Platform.OS === "ios" && isShowKeyboard ? 80 : 20,
//             }}
//           >
//             <View style={styles.addPhotoContainer}>
//               <Camera style={styles.addPhotoBox} ref={setSnap}>
//                 <TouchableOpacity style={styles.photoIcon} onPress={takePhoto}>
//                   <MaterialIcons name="photo-camera" size={24} color="#fff" />
//                 </TouchableOpacity>
//                 {photoPath && (
//                   <Image
//                     source={{ uri: photoPath }}
//                     style={styles.sampleImg}
//                   ></Image>
//                 )}
//               </Camera>

//               <TouchableOpacity
//                 activeOpacity={0.8}
//                 style={styles.addPhoto}
//                 onPress={() => uploadPhoto()}
//               >
//                 <Text style={styles.upLoadPhotoText}>Upload photo</Text>
//               </TouchableOpacity>
//             </View>

//             <View>
//               <View>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Name..."
//                   placeholderTextColor="#BDBDBD"
//                   onFocus={() => setIsShownKeyboard(true)}
//                   onChangeText={setPhotoName}
//                   value={photoName}
//                 ></TextInput>
//               </View>

//               <View>
//                 <TextInput
//                   style={{ ...styles.input, paddingLeft: 28 }}
//                   placeholder="Location..."
//                   placeholderTextColor="#BDBDBD"
//                   onFocus={() => setIsShownKeyboard(true)}
//                   onChangeText={setLocationName}
//                   value={locationName}
//                 ></TextInput>
//                 <Feather
//                   name="map-pin"
//                   size={24}
//                   color="#BDBDBD"
//                   style={styles.locationIcon}
//                 />
//               </View>

//               <TouchableOpacity
//                 style={{
//                   ...styles.button,
//                   display: isShownKeyboard ? "none" : "flex",
//                   backgroundColor: !(photoPath && photoName && locationName)
//                     ? "#FF6C00"
//                     : "#fff",
//                 }}
//                 disabled={!(photoPath && photoName && locationName) || loading}
//                 onPress={onSubmit}
//               >
//                 <View style={styles.textButton}>
//                   {loading ? (
//                     <ActivityIndicator />
//                   ) : (
//                     <Text
//                       style={{
//                         ...styles.btnText,
//                         color: !(photoPath && photoName && locationName)
//                           ? "#f0f8ff"
//                           : "#000",
//                       }}
//                     >
//                       Post
//                     </Text>
//                   )}
//                 </View>
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.deleteButton} onPress={reset}>
//                 <View
//                   style={{
//                     ...styles.deleteButtonBox,
//                     display: isShownKeyboard ? "none" : "flex",
//                   }}
//                 >
//                   <Feather name="trash-2" size={24} color="#BDBDBD" />
//                 </View>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </KeyboardAvoidingView>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontFamily: "Montserrat-Regular",
//     fontSize: 32,
//   },
//   form: {
//     marginHorizontal: 16,
//   },
//   addPhotoContainer: {
//     borderRadius: 16,
//     backgroundColor: "ccc",
//     marginBottom: 32,
//     marginTop: 32,
//   },
//   addPhotoBox: {
//     position: "relative",
//     height: 240,
//     borderRadius: 8,
//     backgroundColor: "#F6F6F6",
//     border: "1px solid #E8E8E8",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   photoIcon: {
//     backgroundColor: "rgba(255, 255, 255, 0.3)",
//     height: 60,
//     width: 60,
//     borderRadius: 30,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   sampleImg: {
//     position: "absolute",
//     left: 0,
//     bottom: 0,
//     height: 80,
//     width: "33%",
//     zIndex: 1,
//   },
//   addPhoto: { marginTop: 8 },
//   upLoadPhotoText: {
//     fontFamily: "Montserrat-Regular",
//     color: "#ccc",
//     fontSize: 16,
//     textAlign: "left",
//   },
//   input: {
//     color: "#000",
//     borderColor: "#E8E8E8",
//     borderBottomWidth: 1,
//     height: 40,
//     marginBottom: 16,
//     fontFamily: "Montserrat-Regular",
//     fontSize: 16,
//   },
//   button: {
//     height: 40,
//     borderRadius: 20,
//     justifyContent: "center",
//     marginTop: 16,
//   },
//   textButton: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   btnText: {
//     textAlign: "center",
//     fontFamily: "Montserrat-Regular",
//     fontSize: 18,
//   },
//   locationIcon: {
//     position: "absolute",
//     left: 0,
//     top: 7,
//   },
//   deleteButtonBox: {
//     alignItems: "center",
//   },
//   deleteButton: {
//     width: 70,
//     marginLeft: "auto",
//     marginRight: "auto",
//     marginTop: 100,
//     justifyContent: "center",
//     alignItems: "center",
//     height: 40,
//     backgroundColor: "#F6F6F6",
//     borderRadius: 20,
//     marginBottom: 36,
//   },
// });

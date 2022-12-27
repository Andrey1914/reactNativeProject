import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Svg, { Circle, Path } from "react-native-svg";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, getDocs, where, query } from "firebase/firestore";
import { storage, db } from "../../firebase/config";

import { updateAvatar, authSignOutUser } from "../../redux/authOperations";
import { pathSlice } from "../../redux/pathReducer";

import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";

export default function RegistrationScreen({ navigation, route }) {
  const { userId, login, avatar } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const uploadPhotoToServer = async (avatar) => {
    try {
      const response = await fetch(avatar);
      const file = await response.blob();
      const storageRef = ref(storage, `avatars/${userId}`);
      await uploadBytes(storageRef, file);
      const path = await getDownloadURL(ref(storage, `avatars/${userId}`));

      return path;
    } catch (error) {
      console.log(error);
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setLoading(true);
        const avatar = await uploadPhotoToServer(result.assets);
        dispatch(updateAvatar(avatar));
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllPosts = async () => {
    const q = query(collection(db, "posts"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    let newPosts = [];
    querySnapshot.forEach((doc) => {
      newPosts.push({ ...doc.data(), id: doc.id });
    });
    setPosts(newPosts);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getAllPosts();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/images/mountain.jpg")}
        style={styles.image}
      >
        <ScrollView
          contentContainerStyle={{ flex: posts.length > 0 ? "none" : 1 }}
          bounces={false}
        >
          <View style={styles.logout}>
            <TouchableOpacity onPress={() => dispatch(authSignOutUser())}>
              <MaterialCommunityIcons name="logout" size={24} color="#4169e1" />
            </TouchableOpacity>
          </View>
          <View style={styles.formBackdrop}>
            <View style={styles.centerBox}>
              <View style={styles.avatarBox}>
                <Image
                  style={{ height: "100%", width: "100%", borderRadius: 16 }}
                  source={{ uri: avatar }}
                ></Image>

                <TouchableOpacity style={styles.addIconBox} onPress={pickImage}>
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
                      stroke="#4169e1"
                    ></Circle>
                    <Path
                      fill="#4169e1"
                      fillRule="evenodd"
                      d="M13 6h-1v6H6v1h6v6h1v-6h6v-1h-6V6z"
                      clipRule="evenodd"
                    ></Path>
                  </Svg>
                </TouchableOpacity>
              </View>
              {loading && <ActivityIndicator style={styles.loader} />}
            </View>

            <Text style={styles.titleText}>{login}</Text>

            <View style={{ marginHorizontal: 16 }}>
              {posts.map((item) => (
                <View style={styles.postBox} key={item.id}>
                  <Image
                    source={{ uri: item.photo }}
                    style={{ height: 240, borderRadius: 16 }}
                  ></Image>

                  <View style={{ marginTop: 8 }}>
                    <Text style={styles.textPost}>{item.name}</Text>
                  </View>

                  <View style={styles.postInfoBox}>
                    <View style={styles.commentsInfo}>
                      <TouchableOpacity
                        onPress={async () => {
                          navigation.navigate("Comments", {
                            photo: item.photo,
                            id: item.id,
                          });
                          dispatch(
                            pathSlice.actions.setPath({ path: route.name })
                          );
                        }}
                      >
                        <EvilIcons name="comment" size={24} color="#fff" />
                      </TouchableOpacity>

                      <Text style={styles.textPost}>{item.comments || 0}</Text>
                    </View>

                    <View style={styles.commentsInfo}>
                      <View>
                        <AntDesign name="like 1" size={24} color="#fff" />
                      </View>

                      <Text style={styles.textPost}>
                        {" "}
                        {item.likes?.length || 0}
                      </Text>
                    </View>

                    <View style={styles.locationInfo}>
                      <Ionicons
                        name="location-outline"
                        size={20}
                        color="#fff"
                      />

                      <Text
                        style={styles.textLocation}
                        onPress={() => {
                          navigation.navigate("Map", {
                            location: item.location,
                            title: item.locationName,
                          }),
                            dispatch(
                              pathSlice.actions.setPath({ path: route.name })
                            );
                        }}
                      >
                        {item.locationName}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
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
  formBackdrop: {
    backgroundColor: "transparent",
    marginTop: 150,
    flex: 1,
  },
  logout: {
    position: "absolute",
    top: 35,
    right: 24,
    zIndex: 1,
  },

  avatarBox: {
    height: 120,
    width: 120,
    borderRadius: 5,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  centerBox: {
    position: "absolute",
    left: 0,
    right: 0,
    top: -120,
    alignItems: "center",
  },
  loader: {
    position: "absolute",
    top: 50,
  },
  addIconBox: {
    position: "absolute",
    right: -13,
    bottom: 8,
  },
  titleText: {
    color: "#fff",
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 33,
    fontSize: 24,
  },
  postBox: {
    marginBottom: 34,
  },
  postInfoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 11,
  },
  commentsInfo: {
    flexDirection: "row",
  },
  locationInfo: {
    flexDirection: "row",
  },
  textPost: {
    color: "#FFF",
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
  },
  textLocation: {
    color: "#FFF",
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { pathSlice } from "../../redux/pathReducer";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

import {
  collection,
  getDocs,
  getDoc,
  arrayUnion,
  arrayRemove,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../../firebase/config";

import { Ionicons } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function PostsScreen({ navigation, route }) {
  console.log("route.params", route.params);
  const [posts, setPosts] = useState([]);
  const { email, login, avatar, userId } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const getAllPosts = async () => {
    const querySnapshot = await getDocs(collection(db, "posts"));
    let newPosts = [];
    querySnapshot.forEach((doc) => {
      newPosts.push({ ...doc.data(), id: doc.id });
    });
    setPosts(newPosts);
  };

  const addLike = async (id) => {
    const result = await getDoc(doc(db, "posts", `${id}`));
    if (result.data().likes?.includes(`${userId}`)) {
      await updateDoc(doc(db, "posts", `${id}`), {
        likes: arrayRemove(`${userId}`),
      });
    } else {
      await updateDoc(doc(db, "posts", `${id}`), {
        likes: arrayUnion(`${userId}`),
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts"),
      (snapshot) => {
        getAllPosts();
      },
      (error) => {
        console.log(error);
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.image}
        source={require("../../../assets/images/mountain.jpg")}
      >
        <View
        // style={{
        //   backgroundColor: "#fff",
        //   marginHorizontal: 16,
        //   marginTop: 32,
        //   marginBottom: 70,
        // }}
        >
          <TouchableOpacity
            style={styles.userBox}
            onPress={() => navigation.navigate("Profile")}
          >
            {avatar ? (
              <Image
                source={{ uri: avatar }}
                style={{
                  height: 60,
                  width: 60,
                  borderRadius: 16,
                }}
              ></Image>
            ) : (
              <View
                style={{
                  width: 40,
                  width: 40,
                  borderRadius: 5,
                  backgroundColor: "#fff",
                }}
              ></View>
            )}
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.textName}>{login}</Text>

              <Text style={styles.textEmail}>{email}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.logout}>
            <TouchableOpacity onPress={() => dispatch(authSignOutUser())}>
              <MaterialCommunityIcons name="logout" size={24} color="#4169e1" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={posts}
            keyExtractor={(item, indx) => indx.toString()}
            renderItem={({ item }) => (
              <View style={styles.postBox}>
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
                    <TouchableOpacity onPress={() => addLike(item.id)}>
                      {item?.likes?.includes(`${userId}`) ? (
                        <AntDesign name="like1" size={24} color="#fff" /> && (
                          <AntDesign name="like2" size={24} color="#fff" />
                        )
                      ) : (
                        <AntDesign name="like2" size={24} color="#fff" />
                      )}
                    </TouchableOpacity>

                    <Text style={styles.textPost}>
                      {" "}
                      {item.likes?.length || 0}
                    </Text>
                  </View>

                  <View style={styles.locationInfo}>
                    <Ionicons name="location-outline" size={20} color="#fff" />

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
            )}
          ></FlatList>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "flex-start",
    // backgroundColor: "#fff",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    // justifyContent: "center",
  },
  logout: {
    position: "absolute",
    top: 35,
    right: 24,
    zIndex: 1,
  },
  userBox: {
    // backgroundColor: "#fff",
    // marginBottom: 32,
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    position: "absolute",
    top: 40,
    left: 16,
  },
  textName: {
    color: "#f0f8ff",
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
  },
  textEmail: {
    color: "#f0f8ff",
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
  },
  textPost: {
    color: "#fff",
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
  },
  textLocation: {
    color: "#FFF",
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  postBox: {
    backgroundColor: "#ccc",
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
});

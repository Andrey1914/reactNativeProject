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

import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

export default function PostsScreen({ navigation, route }) {
  // console.log("route.params", route.params);
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
      <View
        style={{
          // backgroundColor: "#fff",
          marginHorizontal: 16,
          marginTop: 32,
          marginBottom: 70,
        }}
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
                height: 60,
                width: 60,
                borderRadius: 16,
                backgroundColor: "#BDBDBD",
              }}
            ></View>
          )}
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.textName}>{login}</Text>

            <Text style={styles.textEmail}>{email}</Text>
          </View>
        </TouchableOpacity>

        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.postBox}>
              <Image
                source={{ uri: item.photo }}
                style={{ height: 240, borderRadius: 8 }}
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
                      dispatch(pathSlice.actions.setPath({ path: route.name }));
                    }}
                  >
                    <Feather name="message-circle" size={24} color="#BDBDBD" />
                  </TouchableOpacity>

                  <Text style={styles.commentsNumber}>
                    {item.comments || 0}
                  </Text>
                </View>

                <View style={styles.likesInfo}>
                  <TouchableOpacity onPress={() => addLike(item.id)}>
                    {item?.likes?.includes(`${userId}`) ? (
                      <Feather name="thumbs-up" size={24} color="#BDBDBD" />
                    ) : (
                      <AntDesign name="like2" size={24} color="#BDBDBD" />
                    )}
                  </TouchableOpacity>

                  <Text style={styles.likesNumber}>
                    {" "}
                    {item.likes?.length || 0}
                  </Text>
                </View>

                <View style={styles.locationInfo}>
                  <Feather name="map-pin" size={24} color="#BDBDBD" />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  userBox: {
    flexDirection: "row",
    alignItems: "center",
    left: 16,
  },
  textName: {
    color: "#212121",
    fontFamily: "Montserrat-Bold",
    fontSize: 13,
    lineHeight: 15,
  },
  textEmail: {
    color: "rgba(33, 33, 33, 0.8)",
    fontFamily: "Montserrat-Regular",
    fontSize: 11,
    lineHeight: 13,
  },
  textPost: {
    color: "#212121",
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    lineHeight: 19,
  },
  textLocation: {
    color: "#212121",
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    marginLeft: 4,
    lineHeight: 19,
    textDecorationLine: "underline",
  },
  postBox: {
    backgroundColor: "#fff",
    marginBottom: 14,
    marginTop: 32,
  },
  postInfoBox: {
    flexDirection: "row",
    marginTop: 11,
  },
  commentsInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  likesInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: "auto",
    marginLeft: 24,
  },
  commentsNumber: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: "#BDBDBD",
    marginLeft: 6,
  },
  likesNumber: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: "#BDBDBD",
    marginLeft: 6,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
});

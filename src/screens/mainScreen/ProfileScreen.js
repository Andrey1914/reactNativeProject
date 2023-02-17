import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authSignOutUser } from "../../redux/authOperations";
import {
  collection,
  where,
  query,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  ImageBackground,
} from "react-native";
import {
  MaterialIcons,
  Octicons,
  FontAwesome,
  AntDesign,
} from "@expo/vector-icons";

export default function ProfileScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const dispatch = useDispatch();
  const { userId, name, avatar } = useSelector((state) => state.auth);

  //   вихід з акаунта
  const signOut = () => {
    dispatch(authSignOutUser());
  };
  //   відмальовує всі пости на сторінці
  useEffect(() => {
    getUserPost();
  }, []);

  //   шукаємо всі пости одного юзера по userId
  const getUserPost = async () => {
    const postRef = collection(db, "posts");
    const q = query(postRef, where("userId", "==", userId));
    onSnapshot(q, (docSnap) =>
      setPosts(docSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    );
  };
  //   видалення поста з профілю
  const deletePost = async (postId) => {
    await deleteDoc(doc(db, "posts", postId));
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/images/bg-mountain.jpg")}
        style={styles.image}
      >
        <View style={styles.wrapperPosts}>
          <View style={styles.avatarWrapper}>
            <View style={{ overflow: "hidden", borderRadius: 16 }}>
              {avatar && (
                <Image style={styles.avatar} source={{ uri: avatar }} />
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
            <Octicons name="sign-out" size={24} color="#BDBDBD" />
          </TouchableOpacity>
          <View style={styles.profileNameWrapper}>
            <Text style={styles.profileName}>{name}</Text>
          </View>
          <SafeAreaView style={{ flex: 1 }}>
            <FlatList
              data={posts}
              keyExtractor={posts.id}
              renderItem={({ item }) => (
                <View>
                  <TouchableOpacity
                    style={styles.deletePostBtn}
                    onPress={() => deletePost(item.id)}
                  >
                    <MaterialIcons name="close" size={26} color="#212121" />
                  </TouchableOpacity>
                  <Image
                    source={{ uri: item.photo }}
                    style={styles.postImage}
                  />
                  <View style={styles.postImageWrapper}>
                    <Text style={styles.postImageTitle}>
                      {item.description}
                    </Text>
                  </View>
                  <View style={styles.postInfoContainer}>
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        style={{ ...styles.postInfoBtn, marginRight: 25 }}
                        activeOpacity={0.7}
                        onPress={() =>
                          navigation.navigate("Comments", {
                            postId: item.id,
                            photo: item.photo,
                          })
                        }
                      >
                        <FontAwesome
                          name={item.comments ? "comment" : "comment-o"}
                          size={24}
                          color={item.comments ? "#FF6C00" : "#BDBDBD"}
                        />
                        <Text
                          style={{
                            ...styles.postInfoText,
                            color: item.comments ? "#212121" : "#BDBDBD",
                          }}
                        >
                          {item.comments || 0}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.postInfoBtn}
                        activeOpacity={0.7}
                        onPress={() => likeUnlike(item.id)}
                      >
                        <AntDesign
                          name="like2"
                          size={24}
                          color={item.likes ? "#FF6C00" : "#BDBDBD"}
                        />
                        <Text
                          style={{
                            ...styles.postInfoText,
                            color: item.likes ? "#212121" : "#BDBDBD",
                          }}
                        >
                          {item.likes || 0}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={styles.postInfoBtn}
                      activeOpacity={0.7}
                      onPress={() =>
                        navigation.navigate("Map", {
                          location: item.location,
                          title: item.description,
                          description: item.place,
                        })
                      }
                    >
                      <Octicons name="location" size={24} color="#BDBDBD" />
                      <Text
                        style={{
                          ...styles.postInfoText,
                          color: "#212121",
                          textDecorationLine: "underline",
                        }}
                      >
                        {item.city} {item.place}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </SafeAreaView>
        </View>
      </ImageBackground>
    </View>
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
  wrapperPosts: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
    height: 500,
  },
  profileNameWrapper: { marginTop: 62, marginBottom: 27 },
  profileName: {
    fontFamily: "Montserrat-Regular",
    fontSize: 30,
    color: "#212121",
    textAlign: "center",
  },
  logoutBtn: {
    position: "absolute",
    top: 22,
    right: 16,
  },
  deletePostBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 27,
    height: 27,
    backgroundColor: "#fff",
    borderRadius: 50,
    opacity: 0.3,
  },
  avatarWrapper: {
    position: "absolute",
    alignSelf: "center",
    top: -50,
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
  postImage: {
    height: 240,
    borderRadius: 8,
    resizeMode: "cover",
  },
  postImageWrapper: {
    marginTop: 8,
  },
  postImageTitle: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: "#212121",
    marginBottom: 8,
  },
  postInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  postInfoBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  postInfoText: {
    marginLeft: 10,
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
  },
});

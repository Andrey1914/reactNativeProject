import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { Octicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  // addDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";

export default function DefaultPostsScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [userLikes, setUserLikes] = useState("no");
  const [likeCount, setLikeCount] = useState(0);

  //get запрос на firebase всіх постів
  const getAllPosts = async () => {
    const dbRef = collection(db, "posts");
    onSnapshot(dbRef, (docSnap) =>
      setPosts(docSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    );
  };

  //відмальовуваємо всі пости на сторінці
  useEffect(() => {
    getAllPosts();
  }, []);

  const likeUnlike = async (postId) => {
    if (userLikes === "no") {
      setUserLikes("yes");
      setLikeCount(+1);
      createLike(postId);
    } else {
      setUserLikes("no");
      setLikeCount(0 ? 0 : -1);
      createLike(postId);
    }
  };

  const createLike = async (postId) => {
    try {
      const dbRef = doc(db, "posts", postId);
      await updateDoc(dbRef, {
        likes: likeCount,
      });
    } catch (error) {
      console.log("error.message", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header} />

      <FlatList
        data={posts}
        keyExtractor={posts.id}
        renderItem={({ item }) => (
          <View>
            <View style={styles.avatarWrapper}>
              <View style={{ overflow: "hidden", borderRadius: 16 }}>
                <Image style={styles.avatar} source={{ uri: item.avatar }} />
              </View>
              <View style={styles.userInfoWrapper}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
              </View>
            </View>
            <View style={styles.postsContainer}>
              <Image source={{ uri: item.photo }} style={styles.postImage} />
              <View style={styles.postImageWrapper}>
                <Text style={styles.postImageTitle}>{item.description}</Text>
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
          </View>
        )}
      />
    </View>
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
  title: {
    fontFamily: "Montserrat-Regular",
    fontSize: 18,
    lineHeight: 22,
    paddingBottom: 11,
    textAlign: "center",
    color: "#212121",
  },
  avatarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  avatar: {
    width: 60,
    height: 60,
    resizeMode: "cover",
  },
  userInfoWrapper: {
    marginLeft: 10,
  },
  userName: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: "#212121",
  },
  userEmail: {
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
  },
  postsContainer: {
    marginHorizontal: 16,
  },
  postImage: {
    height: 240,
    borderRadius: 8,
    resizeMode: "cover",
  },
  postImageWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    marginBottom: 16,
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

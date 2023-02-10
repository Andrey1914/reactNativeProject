import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// import Svg, { Circle, Path } from "react-native-svg";

// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  getDocs,
  where,
  query,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";

import { authSignOutUser } from "../../redux/authOperations";
// import { pathSlice } from "../../redux/pathReducer";

// import * as ImagePicker from "expo-image-picker";

import {
  // MaterialCommunityIcons,
  // AntDesign,
  // EvilIcons,
  // Ionicons,
  MaterialIcons,
  Octicons,
  FontAwesome,
  AntDesign,
} from "@expo/vector-icons";

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

export default function ProfileScreen({ navigation }) {
  const { userId, name, avatar } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  // const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const signOut = () => {
    dispatch(authSignOutUser());
  };

  useEffect(() => {
    getUserPost();
  }, []);

  const getUserPost = async () => {
    const postRef = collection(db, "posts");
    const q = query(postRef, where("userId", "==", userId));
    onSnapshot(q, (docSnap) =>
      setPosts(docSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    );
  };

  const deletePost = async (postId) => {
    await deleteDoc(doc(db, "posts", postId));
  };

  return (
    <View style={styles.container}>
      {/* <ImageBackground source={imageBg} style={styles.image}> */}
      <ImageBackground style={styles.image}>
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

  // const uploadPhotoToServer = async (avatar) => {
  //   try {
  //     const response = await fetch(avatar);
  //     const file = await response.blob();
  //     const storageRef = ref(storage, `avatars/${userId}`);
  //     await uploadBytes(storageRef, file);
  //     const path = await getDownloadURL(ref(storage, `avatars/${userId}`));

  //     return path;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const pickImage = async () => {
  //   try {
  //     let result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.All,
  //       allowsEditing: true,
  //       aspect: [4, 3],
  //       quality: 1,
  //     });

  //     if (!result.canceled) {
  //       setLoading(true);
  //       const avatar = await uploadPhotoToServer(result.assets);
  //       dispatch(updateAvatar(avatar));
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const getAllPosts = async () => {
  //   const q = query(collection(db, "posts"), where("userId", "==", userId));
  //   const querySnapshot = await getDocs(q);

  //   let newPosts = [];
  //   querySnapshot.forEach((doc) => {
  //     newPosts.push({ ...doc.data(), id: doc.id });
  //   });
  //   setPosts(newPosts);
  // };

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     getAllPosts();
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  // return (
  //   <View style={styles.container}>
  //     <ImageBackground
  //       source={require("../../../assets/images/mountain.jpg")}
  //       style={styles.image}
  //     >
  //       <ScrollView
  //         // contentContainerStyle={{ flex: posts.length > 0 ? "none" : 1 }}
  //         bounces={false}
  //       >
  //         <View style={styles.logout}>
  //           <TouchableOpacity onPress={() => dispatch(authSignOutUser())}>
  //             <MaterialCommunityIcons name="logout" size={24} color="#4169e1" />
  //           </TouchableOpacity>
  //         </View>
  //         <View style={styles.formBackdrop}>
  //           <View style={styles.centerBox}>
  //             <View style={styles.avatarBox}>
  //               <Image
  //                 style={{ height: "100%", width: "100%", borderRadius: 16 }}
  //                 source={{ uri: avatar }}
  //               ></Image>

  //               <TouchableOpacity style={styles.addIconBox} onPress={pickImage}>
  //                 <Svg
  //                   xmlns="http://www.w3.org/2000/svg"
  //                   width="25"
  //                   height="25"
  //                   fill="none"
  //                   viewBox="0 0 25 25"
  //                 >
  //                   <Circle
  //                     cx="12.5"
  //                     cy="12.5"
  //                     r="12"
  //                     fill="none"
  //                     stroke="#4169e1"
  //                   ></Circle>
  //                   <Path
  //                     fill="#4169e1"
  //                     fillRule="evenodd"
  //                     d="M13 6h-1v6H6v1h6v6h1v-6h6v-1h-6V6z"
  //                     clipRule="evenodd"
  //                   ></Path>
  //                 </Svg>
  //               </TouchableOpacity>
  //             </View>
  //             {loading && <ActivityIndicator style={styles.loader} />}
  //           </View>

  //           <Text style={styles.titleText}>{login}</Text>

  //           <View style={{ marginHorizontal: 16 }}>
  //             {posts.map((item) => (
  //               <View style={styles.postBox} key={item.id}>
  //                 <Image
  //                   source={{ uri: item.photo }}
  //                   style={{ height: 240, borderRadius: 16 }}
  //                 ></Image>

  //                 <View style={{ marginTop: 8 }}>
  //                   <Text style={styles.textPost}>{item.name}</Text>
  //                 </View>

  //                 <View style={styles.postInfoBox}>
  //                   <View style={styles.commentsInfo}>
  //                     <TouchableOpacity
  //                       onPress={async () => {
  //                         navigation.navigate("Comments", {
  //                           photo: item.photo,
  //                           id: item.id,
  //                         });
  //                         dispatch(
  //                           pathSlice.actions.setPath({ path: route.name })
  //                         );
  //                       }}
  //                     >
  //                       <EvilIcons name="comment" size={24} color="#fff" />
  //                     </TouchableOpacity>

  //                     <Text style={styles.textPost}>{item.comments || 0}</Text>
  //                   </View>

  //                   <View style={styles.commentsInfo}>
  //                     <View>
  //                       <AntDesign name="like1" size={24} color="#fff" />
  //                     </View>

  //                     <Text style={styles.textPost}>
  //                       {" "}
  //                       {item.likes?.length || 0}
  //                     </Text>
  //                   </View>

  //                   <View style={styles.locationInfo}>
  //                     <Ionicons
  //                       name="location-outline"
  //                       size={20}
  //                       color="#fff"
  //                     />

  //                     <Text
  //                       style={styles.textLocation}
  //                       onPress={() => {
  //                         navigation.navigate("Map", {
  //                           location: item.location,
  //                           title: item.locationName,
  //                         }),
  //                           dispatch(
  //                             pathSlice.actions.setPath({ path: route.name })
  //                           );
  //                       }}
  //                     >
  //                       {item.locationName}
  //                     </Text>
  //                   </View>
  //                 </View>
  //               </View>
  //             ))}
  //           </View>
  //         </View>
  //       </ScrollView>
  //     </ImageBackground>
  //   </View>
  // );
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   image: {
//     flex: 1,
//     resizeMode: "cover",
//     justifyContent: "center",
//   },
//   formBackdrop: {
//     backgroundColor: "transparent",
//     marginTop: 150,
//     flex: 1,
//   },
//   logout: {
//     position: "absolute",
//     top: 35,
//     right: 24,
//     zIndex: 1,
//   },

//   avatarBox: {
//     height: 120,
//     width: 120,
//     borderRadius: 5,
//     backgroundColor: "#fff",
//     borderColor: "#ccc",
//     borderWidth: 1,
//   },
//   centerBox: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     top: -120,
//     alignItems: "center",
//   },
//   loader: {
//     position: "absolute",
//     top: 50,
//   },
//   addIconBox: {
//     position: "absolute",
//     right: -13,
//     bottom: 8,
//   },
//   titleText: {
//     color: "#fff",
//     fontFamily: "Montserrat-Regular",
//     textAlign: "center",
//     marginTop: 10,
//     marginBottom: 33,
//     fontSize: 24,
//   },
//   postBox: {
//     marginBottom: 34,
//   },
//   postInfoBox: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 11,
//   },
//   commentsInfo: {
//     flexDirection: "row",
//   },
//   locationInfo: {
//     flexDirection: "row",
//   },
//   textPost: {
//     color: "#FFF",
//     fontFamily: "Montserrat-Regular",
//     fontSize: 16,
//   },
//   textLocation: {
//     color: "#FFF",
//     fontFamily: "Montserrat-Regular",
//     fontSize: 16,
//     textDecorationLine: "underline",
//   },
// });

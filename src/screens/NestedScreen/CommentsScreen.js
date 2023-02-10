import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  // getDocs,
  doc,
  updateDoc,
  onSnapshot,
  // increment,
} from "firebase/firestore";

import {
  Image,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  ImageBackground,
  FlatList,
} from "react-native";
// import { useIsFocused } from "@react-navigation/native";

import { AntDesign } from "@expo/vector-icons";

export default function CommentsScreen({ route }) {
  // const { photo, id } = route.params;
  const { postId, photo } = route.params;
  const { userId, name, avatar } = useSelector((state) => state.auth);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [allComments, setAllComments] = useState([]);
  const [comment, setComment] = useState("");
  // const isFocused = useIsFocused();

  // const { userId, login, avatar } = useSelector((state) => state.auth);
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

  // const getAllComments = async () => {
  //   const querySnapshot = await getDocs(
  //     collection(db, "posts", `${id}`, "comments")
  //   );
  //   let allComments = [];
  //   querySnapshot.forEach((doc) => {
  //     allComments.push({ ...doc.data(), id: doc.id });
  //   });
  //   setComments(allComments);
  // };

  // useEffect(() => {
  //   getAllComments();
  //   const hideKeyboard = Keyboard.addListener("keyboardDidHide", () => {
  //     setIsShownKeyboard(false);
  //   });

  //   return () => {
  //     hideKeyboard.remove();
  //   };
  // }, [comment, isFocused]);

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const createComment = () => {
    sendCommentToServer();
    setComment("");
    keyboardHide();
  };

  const sendCommentToServer = async () => {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    try {
      const dbRef = doc(db, "posts", postId);
      await updateDoc(dbRef, {
        comments: allComments.length + 1,
      });
      await addDoc(collection(dbRef, "comments"), {
        comment,
        name,
        date,
        time,
        userId,
        avatar,
      });
    } catch (error) {
      console.log("error.message", error.message);
    }
  };

  const getAllComments = async () => {
    try {
      const dbRef = doc(db, "posts", postId);
      onSnapshot(collection(dbRef, "comments"), (docSnap) =>
        setAllComments(docSnap.docs.map((doc) => ({ ...doc.data() })))
      );
    } catch (error) {
      console.log(`getAllComments`, error);
    }
  };

  useEffect(() => {
    getAllComments();
  }, []);

  const renderItem = ({ item }) => {
    const currentUser = userId === item.userId;

    return (
      <View
        style={{
          marginTop: 32,
          flexDirection: currentUser ? "row" : "row-reverse",
        }}
      >
        <Image
          source={{ uri: item.avatar }}
          style={{
            ...styles.avatarIcon,
            marginRight: currentUser ? 15 : 0,
            marginLeft: currentUser ? 0 : 15,
          }}
        />
        <View style={styles.comment}>
          <Text
            style={{
              ...styles.commentAuthor,
              textAlign: currentUser ? "left" : "right",
            }}
          >
            {currentUser ? "You" : item.name}
          </Text>
          <Text
            style={{
              ...styles.commentMessage,
              textAlign: currentUser ? "left" : "right",
            }}
          >
            {item.comment}
          </Text>
          <Text
            style={{
              ...styles.commentDate,
              textAlign: currentUser ? "left" : "right",
              textAlign: currentUser ? "left" : "right",
            }}
          >
            {item.date} | {item.time}
          </Text>
        </View>
      </View>
    );
  };

  // const addComment = async () => {
  //   if (comment.trim().length === 0) {
  //     keyboardHide();
  //     return;
  //   }
  //   try {
  //     const date = new Date().toLocaleString();
  //     await addDoc(collection(db, "posts", `${id}`, "comments"), {
  //       comment,
  //       login,
  //       userId,
  //       date,
  //       avatar,
  //     });
  //     await updateDoc(doc(db, "posts", `${id}`), {
  //       comments: increment(1),
  //     });
  //   } catch (error) {
  //     console.log("Error adding document: ", error);
  //   }
  //   setComment("");
  //   keyboardHide();
  // };

  // return (
  //   <TouchableWithoutFeedback onPress={keyboardHide}>
  //     <View style={styles.container}>
  //       <View style={{ marginHorizontal: 16, marginTop: 32, flex: 1 }}>
  //         <Image
  //           source={{ uri: photo }}
  //           style={{ height: 240, borderRadius: 8, marginBottom: 32 }}
  //         ></Image>

  //         <FlatList
  //           style={{ marginBottom: 10 }}
  //           data={comments}
  //           keyExtractor={(item) => item.id}
  //           renderItem={({ item }) => (
  //             <View
  //               style={{
  //                 ...styles.commentBox,
  //                 flexDirection: item.userId === userId ? "row" : "row-reverse",
  //               }}
  //               onStartShouldSetResponder={() => true}
  //             >
  //               <View style={styles.comment}>
  //                 <Text style={styles.text}>{item?.comment}</Text>

  //                 <Text style={styles.textDate}>{item?.date}</Text>
  //               </View>

  //               <Image
  //                 source={{ uri: item.avatar }}
  //                 style={{
  //                   ...styles.avatar,
  //                   marginLeft: item.userId === userId ? 16 : 0,
  //                   marginRight: item.userId === userId ? 0 : 16,
  //                 }}
  //               ></Image>
  //             </View>
  //           )}
  //         ></FlatList>

  //         <KeyboardAvoidingView
  //           behavior={Platform.OS === "ios" ? "padding" : "height"}
  //           keyboardVerticalOffset={100}
  //         >
  //           <View style={{ marginBottom: 32 }}>
  //             <TextInput
  //               style={{ ...styles.input, height: !isShownKeyboard ? 40 : 120 }}
  //               placeholder="Add comment..."
  //               placeholderTextColor="#BDBDBD"
  //               onFocus={() => setIsShownKeyboard(true)}
  //               onChangeText={setComment}
  //               value={comment}
  //               multiline={true}
  //               textAlignVertical="top"
  //               numberOfLines={3}
  //             ></TextInput>

  //             <TouchableOpacity style={styles.button} onPress={addComment}>
  //               <AntDesign name="arrowup" size={24} color="#fff" />
  //             </TouchableOpacity>
  //           </View>
  //         </KeyboardAvoidingView>
  //       </View>
  //     </View>
  //   </TouchableWithoutFeedback>
  // );

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={{ ...styles.container }}>
        <Image
          source={{ uri: photo }}
          style={{ height: 240, borderRadius: 8 }}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <FlatList
            data={allComments}
            keyExtractor={allComments.id}
            renderItem={renderItem}
          />
        </SafeAreaView>

        <View style={styles.inputContainer}></View>
        <View>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Add comment"
            onFocus={() => setIsShowKeyboard(true)}
            style={{
              ...styles.submitBtn,
              // fontFamily: "Roboto",
            }}
          />

          <TouchableOpacity
            style={styles.addCommentBtn}
            activeOpacity={0.7}
            onPress={createComment}
          >
            <AntDesign name="arrowup" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 32,
  },
  avatarIcon: {
    height: 40,
    width: 40,
    borderRadius: 40,
    overflow: "hidden",
    resizeMode: "cover",
  },
  comment: {
    marginLeft: 16,
    padding: 14,
    width: 300,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  commentMessage: {
    marginBottom: 5,
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: "#212121",
  },
  commentDate: {
    fontFamily: "Montserrat-Regular",
    fontSize: 10,
    color: "#BDBDBD",
  },
  submitBtn: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
    padding: 16,
    height: 50,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: "rgba(189, 189, 189, 1)",
    backgroundColor: "#E8E8E8",
  },
  addCommentBtn: {
    position: "absolute",
    right: 6,
    bottom: 5,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    backgroundColor: "#FF6C00",
    borderRadius: 50,
  },
  commentAuthor: {
    marginBottom: 5,
    fontFamily: "Montserrat-Regular",
    fontSize: 11,
    color: "#656565",
  },
  //   inputContainer: {
  //     marginHorizontal: 10,
  //     marginBottom: 20,
  //   },
  //   input: {
  //     borderBottomWidth: 1,
  //     borderBottomColor: "#E8E8E8",
  //     height: 50,
  //     fontSize: 16,
  //   },
});
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "flex-start",
//     backgroundColor: "#fff",
//   },
//   text: {
//     color: "#FFF",
//     padding: 6,
//   },
//   textDate: {
//     textAlign: "right",
//     fontSize: 11,
//     paddingRight: 6,
//   },
//   input: {
//     padding: 10,
//     backgroundColor: "#F6F6F6",
//     borderWidth: 1,
//     borderColor: "#E8E8E8",
//     borderRadius: 20,
//     color: "#212121",
//     paddingEnd: 40,
//   },
//   button: {
//     position: "absolute",
//     right: 5,
//     top: 5,
//     height: 30,
//     width: 30,
//     borderRadius: 30,
//     backgroundColor: "#FF6C00",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   commentBox: {
//     flexDirection: "row",
//     marginBottom: 10,
//     minHeight: 30,
//   },
//   comment: {
//     backgroundColor: "#515151",
//     borderRadius: 4,
//     flex: 1,
//   },
//   avatar: {
//     height: 28,
//     width: 28,
//     backgroundColor: "#515151",
//     borderRadius: 28,
//   },
// });

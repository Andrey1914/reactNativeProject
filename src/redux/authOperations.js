import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";

import { Alert } from "react-native";

import { auth } from "../firebase/config";
import { authSlice } from "./authReducer";

const { updateUserProfile, authStateChange, authSignOut } = authSlice.actions;

export const authSignUpUser =
  ({ name, email, password, avatar }) =>
  async (dispatch) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: avatar,
      });

      const { uid, displayName, photoURL } = await auth.currentUser;
      dispatch(
        updateUserProfile({
          userId: uid,
          name: displayName,
          email,
          avatar: photoURL,
        })
      );
      Alert.alert(`Welcome to cabinet`);

      // const updatedUser = auth.currentUser;
      // return updatedUser;
    } catch (error) {
      Alert.alert(error.message);
      console.log("error.message", error.message);
    }
  };

export const authSignInUser =
  ({ email, password }) =>
  async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      Alert.alert(`Welcome to cabinet`);
    } catch (error) {
      Alert.alert(error.message);
      console.log("error.message", error.message);
    }
  };

export const authSignOutUser = () => async (dispatch) => {
  try {
    await signOut(auth);
    // dispatch(authSlice.actions.authLogout());
    dispatch(authSignOut());
    Alert.alert(`Sign-out successful`);
  } catch (error) {
    Alert.alert(error.message);
    console.log("error.message", error.message);
  }
};

export const authStateChangeUser = () => async (dispatch) => {
  onAuthStateChanged(auth, (user) => {
    // try {
    // await onAuthStateChanged(auth, (user) => {
    if (user) {
      const { uid, displayName, email, photoURL } = user;
      dispatch(
        updateUserProfile({
          userId: uid,
          name: displayName,
          email: email,
          avatar: photoURL,
        })
      );
      dispatch(authStateChange({ stateChange: true }));
    }
  });
  // } catch (error) {
  //   console.log(error.message);
  // }
  // })
};

// export const updateAvatar = (newAvatar) => async (dispatch, getState) => {
//   try {
//     await updateProfile(auth.currentUser, {
//       photoURL: newAvatar,
//     });
//     const updatedUser = auth.currentUser;
//     dispatch(
//       authSlice.actions.updateAvatarAction({
//         avatar: updatedUser.photoURL,
//       })
//     );
//   } catch (error) {
//     console.log(error.message);
//   }
// };

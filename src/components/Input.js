import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
} from "react-native";

const Input = ({ password, onFocus = () => {}, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(password);

  return (
    <View>
      <TextInput
        style={{
          ...styles.input,
          borderColor: isFocused ? "#FF6C00" : "#E8E8E8",
          backgroundColor: isFocused ? "#FFFFFF" : "#F6F6F6",
        }}
        autoCorrect={false}
        onFocus={() => {
          onFocus();
          setIsFocused(true);
        }}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={hidePassword}
        {...props}
      />
      {password && (
        <TouchableOpacity
          style={styles.showPassBtn}
          onPress={() => setHidePassword(!hidePassword)}
        >
          <Text style={styles.switchTextPassword}>
            {hidePassword ? "show" : "hide"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    width: "100%",
    padding: 15,
    marginBottom: 16,
  },
  showPassBtn: {
    position: "absolute",
    right: 16,
    top: "30%",
  },
  switchTextPassword: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: "#1B4371",
  },
});

export default Input;

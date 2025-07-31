import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { sharedStyles } from "../styles/SharedStyles";

const CustomCheckBox = (props) => {
  const { checked, onPress, title } = props;
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && sharedStyles.pressed
      ]}
      onPress={onPress}
    >
      <Ionicons
        name={checked ? "checkbox" : "square-outline"}
        size={24}
        color={checked ? "#d5a203" : "#757575"}
      />
      <Text style={{ paddingLeft: 5, fontWeight: "bold" }}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  }
});

export default CustomCheckBox;

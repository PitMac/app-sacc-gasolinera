import { Pressable, StyleSheet, Text } from "react-native";
import React from "react";

export default function CustomButton(props) {
  const { label, onPress, disabled = false, background = "#d5a203" } = props;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => ({
        backgroundColor: background,
        padding: 20,
        borderRadius: 10,
        marginBottom: 10,
        opacity: pressed ? 0.5 : 1,
      })}>
      <Text
        style={styles.text}>
        {label}
      </Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
    color: "#fff",
  }
})

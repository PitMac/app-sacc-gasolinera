import { View, Text, Pressable } from "react-native";
import GlobalIcon from "./GlobalIcon";

export default function CustomModalAppBar({ title, closeModal }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{title}</Text>
      <Pressable onPress={() => closeModal()}>
        {({ pressed }) => (
          <View
            style={{
              padding: 5,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            }}
          >
            <GlobalIcon family="ion" name="close" size={30} />
          </View>
        )}
      </Pressable>
    </View>
  );
}

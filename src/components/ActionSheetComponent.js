import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import ActionSheet from "react-native-actions-sheet";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { sharedStyles } from "../styles/SharedStyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ActionSheetComponent(props) {
  const insets = useSafeAreaInsets();
  const { actionSheetRef, buttons } = props;
  return (
    <View>
      <ActionSheet
        containerStyle={{ padding: 8, paddingBottom: insets.bottom }}
        ref={actionSheetRef}
      >
        <View style={{ alignItems: "flex-end" }}>
          <TouchableOpacity onPress={() => actionSheetRef.current?.hide()}>
            <Ionicons name="close" size={36} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={{ height: 10 }} />
        {buttons.map((button, index) => (
          <View style={styles.viewButton} key={index}>
            <Pressable
              onPress={() => {
                button.onPress && button.onPress();
                actionSheetRef.current?.hide();
              }}
              style={({ pressed }) => [
                styles.button,
                pressed && sharedStyles.pressed,
              ]}
            >
              <Text style={{ fontWeight: "500", fontSize: 16 }}>
                {button.text}
              </Text>
              <MaterialIcons
                name={button.iconName}
                size={36}
                color={button.color}
              />
            </Pressable>
            <View
              style={{ height: 1, backgroundColor: "#ccc", marginVertical: 5 }}
            />
          </View>
        ))}
      </ActionSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  viewButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

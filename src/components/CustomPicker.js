import {
  View,
  Text,
  Modal,
  FlatList,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useState, useEffect } from "react";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { TextInput, useTheme } from "react-native-paper";
import GlobalIcon from "./GlobalIcon";
import { Colors } from "../utils/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomPicker(props) {
  const { items, onValueChange, dropdownIconColor, text } = props;
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [modalVisible, setModalVisible] = useState(false);
  const [internalVisible, setInternalVisible] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState(items || []);

  const screenHeight = 800;
  const translateY = useSharedValue(screenHeight);

  const keyboardOffset = useSharedValue(0);

  const onKeyboardShow = (height) => {
    keyboardOffset.value = withTiming(height, { duration: 250 });
  };

  const onKeyboardHide = () => {
    keyboardOffset.value = withTiming(0, { duration: 250 });
  };

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      runOnJS(onKeyboardShow)(e.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      runOnJS(onKeyboardHide)();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const openModal = () => {
    setInternalVisible(true);
    setModalVisible(true);

    translateY.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
  };

  const closeModal = () => {
    translateY.value = withTiming(
      screenHeight,
      {
        duration: 260,
        easing: Easing.in(Easing.ease),
      },
      () => {
        runOnJS(setInternalVisible)(false);
        runOnJS(setModalVisible)(false);
        runOnJS(setSearchText)("");
      }
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value - keyboardOffset.value }],
  }));

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) =>
        item.label.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchText, items]);

  const handleSelect = (value, index) => {
    closeModal();
    onValueChange(value, index);
  };

  const isPlaceholder = String(text).includes("SELECCIONE");

  return (
    <>
      <Pressable
        onPress={openModal}
        style={({ pressed }) => [
          styles.pickerButton,
          {
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        <GlobalIcon
          family="ion"
          name="chevron-down-sharp"
          size={24}
          color={isPlaceholder ? "grey" : Colors.primary}
        />
        <View style={styles.textWrapper}>
          <Text
            numberOfLines={1}
            style={{ color: isPlaceholder ? "grey" : dropdownIconColor }}
          >
            {text}
          </Text>
        </View>
      </Pressable>

      <Modal
        transparent
        statusBarTranslucent
        navigationBarTranslucent
        animationType="fade"
        visible={modalVisible}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.sheetContainer, animatedStyle]}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 10 }]}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Seleccionar</Text>
              <Pressable onPress={closeModal}>
                {({ pressed }) => (
                  <View
                    style={{
                      padding: 5,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    }}
                  >
                    <GlobalIcon
                      family="ion"
                      name="close"
                      size={30}
                      color="#000"
                    />
                  </View>
                )}
              </Pressable>
            </View>

            <TextInput
              label="Buscar..."
              mode="outlined"
              value={searchText}
              onChangeText={setSearchText}
              style={{ backgroundColor: "white", marginBottom: 12 }}
            />

            <FlatList
              data={filteredItems}
              keyExtractor={(item) => item.value}
              style={{ maxHeight: 350 }}
              renderItem={({ item, index }) => {
                const isSelected = text === item.label;
                return (
                  <Pressable
                    onPress={() => handleSelect(item.value, index)}
                    style={({ pressed }) => [
                      styles.item,
                      {
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: isSelected ? theme.colors.primary : "#000",
                      }}
                    >
                      {item.label}
                    </Text>

                    {isSelected && (
                      <GlobalIcon
                        family="ion"
                        name="checkmark-circle-sharp"
                        size={22}
                        color={theme.colors.primary}
                      />
                    )}
                  </Pressable>
                );
              }}
            />
          </View>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pickerButton: {
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    borderColor: "#79747E",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    height: 45,
  },

  textWrapper: {
    alignItems: "center",
  },

  backdrop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  sheetContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },

  sheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  headerText: {
    fontSize: 18,
    fontWeight: "600",
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
});

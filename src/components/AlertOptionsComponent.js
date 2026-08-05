import React from "react";
import { Modal, View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { useModalStore } from "../stores/ModalStore";
import { Colors } from "../utils/Colors";

const ModalOption = () => {
  const { modalProps, hideModal } = useModalStore();
  if (!modalProps) return null;

  return (
    <Modal
      transparent={true}
      visible={true}
      animationType="fade"
      onRequestClose={() => hideModal(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.dialogContainer}>
          <Text style={styles.title}>{modalProps.title}</Text>
          <Text style={styles.content}>{modalProps.content}</Text>
          <View style={styles.actionsContainer}>
            <Pressable
              android_ripple={{ color: "#E0E0E0", borderless: false, radius: 20 }}
              onPress={() => hideModal(false)}
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                pressed && Platform.OS === "ios" && styles.buttonPressed,
              ]}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>

            <Pressable
              android_ripple={{ color: "rgba(255, 255, 255, 0.2)", borderless: false, radius: 20 }}
              onPress={() => hideModal(true)}
              style={({ pressed }) => [
                styles.button,
                styles.acceptButton,
                pressed && Platform.OS === "ios" && styles.buttonPressed,
              ]}
            >
              <Text style={styles.acceptText}>Aceptar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 24,
  },
  dialogContainer: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 28,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1C1B1E",
    marginBottom: 12,
    lineHeight: 28,
  },
  content: {
    fontSize: 14,
    color: "#49454F",
    marginBottom: 24,
    lineHeight: 24,
    letterSpacing: 0.25,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 88,
  },
  cancelButton: {
    backgroundColor: "transparent",
  },
  acceptButton: {
    backgroundColor: Colors.primary ?? "#6750A4",
  },
  cancelText: {
    color: Colors.primary ?? "#6750A4",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  acceptText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  buttonPressed: {
    opacity: 0.7,
  },
});

export default ModalOption;
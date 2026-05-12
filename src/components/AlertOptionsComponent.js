import React from "react";
import { Modal, View, Text, Pressable } from "react-native";
import { useModalStore } from "../stores/ModalStore";
import { Colors } from "../utils/Colors";

const ModalOption = () => {
  const { modalProps, hideModal } = useModalStore();
  if (!modalProps) return null;

  return (
    <Modal transparent={true} visible={true} animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          paddingHorizontal: 10,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 15,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.1,
            shadowRadius: 15,
            elevation: 5,
            width: "90%",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#333",
              marginBottom: 10,
            }}
          >
            {modalProps.title}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#555",
              marginBottom: 20,
            }}
          >
            {modalProps.content}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
            }}
          >
            <Pressable
              onPress={() => hideModal(false)}
              style={({ pressed }) => ({
                backgroundColor: "white",
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Text style={{ fontSize: 15 }}>Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={() => hideModal(true)}
              style={({ pressed }) => ({
                backgroundColor: "white",
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Text
                style={{
                  color: Colors.primary,
                  fontSize: 15,
                }}
              >
                Aceptar
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalOption;

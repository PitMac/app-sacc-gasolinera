import { View, Text, Alert, FlatList, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import instance from "../utils/Instance";
import CustomAppBar from "./CustomAppBar";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Divider } from "react-native-paper";
import { sharedStyles } from "../styles/SharedStyles";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export default function ListClientesByPlacaComponent({
                                                       periodofiscal_id,
                                                       setIsLoading,
                                                       objHeadBilling,
                                                       setSearchListModal,
                                                       actionClick
                                                     }) {

  const [clientes, setClientes] = useState([]);
  const insets = useSafeAreaInsets();
  const keyExtractor = (item, index) => index.toString();

  useEffect(() => {
    async function getInformation() {

      setIsLoading(true);
      const numeroplaca = objHeadBilling.placa.replace(/[-]/g, "");

      instance.get(`api/v1/cartera/cliente/search/placa/list/${periodofiscal_id}/${numeroplaca.toUpperCase()}`)
        .then((resp) => {
          if (!resp.data.item || resp.data.item.length === 0) {
            Alert.alert("Información", "No se encontró ningún cliente con esa placa.");
            setSearchListModal(false);
          } else {
            setClientes(resp.data.item);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);

          Alert.alert("Información", "La consulta no se pudo realizar correctamente, por favor intente nuevamente!");
        });


    }

    getInformation();
  }, []);

  const renderClientes = ({ item, index }) => {
    return (
      <>
        <Pressable
          onPress={() => actionClick(item)}
          style={({ pressed }) => [
            styles.button,
            pressed && sharedStyles.pressed
          ]}
        >
          <View style={{ marginRight: 5 }}>
            <Ionicons name="person-circle-outline" size={30} color="#d5a203" style={styles.searchIcon} />
          </View>
          <View>
            <Text>{item.codigo} | {item.nombrecompleto}</Text>
            <Text>Ruc: {item.numeroidentificacion}</Text>
          </View>
        </Pressable>
        <Divider />
      </>
    );
  };

  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      <CustomAppBar
        center={true}
        bold={true}
        rightIcon="close"
        onRightPress={() => {
          setSearchListModal(false);
        }}
        title={"Lista de Clientes por Placa"}
      />
      <FlatList
        keyExtractor={keyExtractor}
        data={clientes}
        renderItem={renderClientes}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20
  },
  searchIcon: {
    marginLeft: 7,
    paddingTop: 7
  }
});

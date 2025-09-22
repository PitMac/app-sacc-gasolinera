import {
  View,
  Text,
  Alert,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { getToken } from "../utils/Utils";
import Loader from "./Loader";
import instance from "../utils/Instance";
import { Divider, TextInput } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomPicker from "./CustomPicker";
import CustomAppBar from "./CustomAppBar";
import { sharedStyles } from "../styles/SharedStyles";

export default function SearchCustomer(props) {
  const insets = useSafeAreaInsets();
  const { actionCloseModal, actionClick, navigation } = props;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState("nombre");
  const [isloading, setIsLoading] = useState(false);
  const [periodofiscal_id, setPeriodofiscal_id] = useState(0);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    callDataInitial();
  }, []);

  useEffect(() => {
    setSearchQuery("");
  }, [selectedOption]);

  const callDataInitial = async () => {
    setSelectedOption("nombre");
    const localstorage = await getToken("configuration");
    if (localstorage && "periodofiscal_id" in localstorage) {
      setPeriodofiscal_id(localstorage.periodofiscal_id);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const searchCustomer = async () => {
    setIsLoading(true);
    try {
      const searchInPath = searchQuery
        .replaceAll("%", "&&")
        .replaceAll("/", "~~");
      const parameterSearch =
        selectedOption === "all"
          ? searchInPath
          : selectedOption + ":" + searchInPath;
      const response = await instance.get(
        `api/v1/cartera/cliente/search/${periodofiscal_id}/${selectedOption}:${
          parameterSearch !== "" ? searchInPath : "&&"
        }`,
        {
          params: {
            type_search: selectedOption,
            ismobile: true,
          },
        }
      );
      if (response.data.status === 200) {
        setClientes(response.data.items);
      } else {
        Alert.alert(
          "Información",
          "Hubo un problema al consultar los clientes"
        );
      }
    } catch (error) {
      Alert.alert(
        "Alerta",
        "Hubo un problema al consultar los clientes en el servidor"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderClientes = ({ item, index }) => {
    return (
      <>
        <Pressable
          onPress={() => actionClick(item)}
          style={({ pressed }) => [
            styles.clientes,
            pressed && sharedStyles.pressed,
          ]}
        >
          <View style={{ marginRight: 5 }}>
            <Ionicons
              name="person-circle-outline"
              size={30}
              color="#d5a203"
              style={styles.searchIcon}
            />
          </View>
          <View>
            <Text>
              {item.codigo} | {item.nombrecompleto}
            </Text>
            <Text>Ruc: {item.numeroidentificacion}</Text>
          </View>
        </Pressable>
        <Divider />
      </>
    );
  };

  return (
    <View style={[styles.contentModal, { paddingBottom: insets.bottom + 10 }]}>
      <CustomAppBar
        center={true}
        rightIcon="close"
        onRightPress={() => actionCloseModal()}
        title={"BUSQUEDA DE CLIENTE"}
        bold={true}
      />
      <Loader loading={isloading} />
      <View style={styles.containerBarSearch}>
        <CustomPicker
          items={[
            { label: "Codigo", value: "codigo" },
            { label: "Nombre", value: "nombre" },
            { label: "Ruc", value: "ruc" },
          ]}
          selectedValue={selectedOption}
          onValueChange={(value, index) => {
            handleOptionSelect(value);
          }}
          dropdownIconColor={"#d5a203"}
          text={selectedOption.toUpperCase()}
        />
        <TextInput
          mode={"outlined"}
          right={<TextInput.Icon icon="magnify" onPress={searchCustomer} />}
          returnKeyType="search"
          style={{ flex: 1, marginLeft: 10 }}
          placeholder={`Digite el ${selectedOption}...`}
          placeholderTextColor="#a8a8a8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={searchCustomer}
          keyboardType={selectedOption === "nombre" ? "text" : "number-pad"}
        />
        <View style={{ width: 10 }} />
      </View>
      <SafeAreaView style={{ flex: 1, marginTop: 10 }}>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={clientes}
          renderItem={renderClientes}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  containerBarSearch: {
    marginTop: 20,
    borderRadius: 20,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    marginHorizontal: 5,
  },
  dropdownIcon: {
    marginRight: 5,
  },
  dropdown: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    zIndex: 2,
  },
  option: {
    fontSize: 12,
    color: "#000",
    paddingVertical: 5,
  },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
    fontSize: 12,
    color: "#000",
    flex: 1,
  },
  searchIcon: {
    marginLeft: 7,
    paddingTop: 7,
  },
  contentModal: {
    flex: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  clientes: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
  },
});

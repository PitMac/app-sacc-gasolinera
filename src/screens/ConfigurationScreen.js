import { View, Text, StyleSheet, Alert, Modal, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { windowWidth } from "../utils/Dimensions";
import CustomButton from "../components/CustomButton";
import useAuthStore from "../stores/AuthStore";
import { getToken, mergeStorage } from "../utils/Utils";
import instance from "../utils/Instance";
import Loader from "../components/Loader";
import CustomAppBar from "../components/CustomAppBar";
import CustomCheckBox from "../components/CustomCheckBox";
import { sharedStyles } from "../styles/SharedStyles";
import useThemeStore from "../stores/ThemeStore";
import {
  useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";

export default function ConfigurationScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const logout = useAuthStore((state) => state.logout);
  const [isloading, setIsLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [usuario, setUsuario] = useState({
    username: "",
    email: "",
    periodosfiscales: [],
  });
  const [modalPeriodo, setModalPeriodo] = useState(false);
  const [modalEstaciones, setModalEstaciones] = useState(false);
  const [respIdPeriodoSelect, setRespIdPeriodoSelect] = useState(0);
  const [idPeriodoSelect, setIdPeriodoSelect] = useState(0);
  const [datosEstaciones, setdatosEstaciones] = useState([]);
  const [selectedEstaciones, setSelectedEstaciones] = useState([]);

  useEffect(() => {
    callDataInitial();
  }, [refreshData]);

  const callDataInitial = async () => {
    const localstorage = await getToken("configuration");
    setUsuario(localstorage.userData);
    if (localstorage && "periodofiscal_id" in localstorage) {
      setIdPeriodoSelect(localstorage.periodofiscal_id);
      setRespIdPeriodoSelect(localstorage.periodofiscal_id);
      setIsLoading(true);
      refreshParametrizacionApp(localstorage.periodofiscal_id);
      if ("listEstaciones" in localstorage) {
        setSelectedEstaciones(localstorage.listEstaciones);
      }
    }
    if (localstorage && "data" in localstorage) {
      setdatosEstaciones(localstorage.data);
    }
  };

  const toggleSurtidorSelection = (surtidorId) => {
    setSelectedEstaciones((prevSelected) => {
      if (prevSelected.includes(surtidorId)) {
        return prevSelected.filter((id) => id !== surtidorId);
      } else {
        return [...prevSelected, surtidorId];
      }
    });
  };

  const groupedData = usuario.periodosfiscales.reduce((acc, obj) => {
    const objContribuyente = obj;
    const key = `${objContribuyente.contribuyente_id} - ${objContribuyente.razonsocial}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});

  const saveSelectedPeriodo = () => {
    if (idPeriodoSelect !== respIdPeriodoSelect) {
      setModalPeriodo(false);
      mergeStorage({ periodofiscal_id: idPeriodoSelect }, "configuration");
      Alert.alert(
        "INFORMACIÓN",
        "Se ha cambiado el periodo satisfactoriamente, a continuacion se cerrara sesion para actualizar sus configuraciones",
        [
          {
            text: "Ok",
            onPress: () => logout(),
          },
        ]
      );
    } else {
      setModalPeriodo(false);
    }
  };

  const saveSelectedEstaciones = () => {
    if (selectedEstaciones.length === 0) {
      Alert.alert("INFORMACIÓN", "Debe seleccionar al menos una estacion", [
        {
          text: "Ok",
        },
      ]);
      return;
    }
    setModalEstaciones(false);
    mergeStorage({ listEstaciones: selectedEstaciones }, "configuration");
    Alert.alert(
      "INFORMACIÓN",
      "Se han guardado las Estaciones satisfactoriamente",
      [
        {
          text: "Ok",
          onPress: () => navigation.navigate("Home"),
        },
      ]
    );
  };

  const refreshParametrizacionApp = async (periodoFiscal) => {
    if (periodoFiscal > 0) {
      setIsLoading(true);

      try {
        const resp = await instance.get(
          `api/v1/general/datos/maestros/configuracion/usuario/${periodoFiscal}`
        );
        if (resp.data.status === 200) {
          const uniqueStations = new Map();

          resp.data.estaciones.forEach((item) => {
            const id = item.id;
            if (!uniqueStations.has(id)) {
              uniqueStations.set(id, { id: id, nombre: item.nombre });
            }
          });

          const data = Array.from(uniqueStations.values());
          mergeStorage(
            {
              configurationUser: resp.data.items,
              porcentajeIVA: resp.data.porcentajeImpuesto,
              parametrizacion: resp.data.parametrizacion,
              turnoActivo: resp.data.turnoActivo,
              surtidores: resp.data.surtidores,
              data: data,
              establecimiento: resp.data.establecimiento,
              estaciones: resp.data.estaciones,
              impresora: resp.data.impresora,
              menuId: resp.data.menuId,
              tipoPago: resp.data.tipoPago,
              bancos: resp.data.bancos,
              tarjetas: resp.data.tarjetas,
              tipo_identificacion: resp.data.tipo_identificacion,
              estados_civil: resp.data.estados_civil,
              sexos: resp.data.sexos,
              establecimientoContable: resp.data.establecimientoContable,
              defaultEstado: resp.data.defaultEstado,
              defaultCiudad: resp.data.defaultCiudad,
              defaultPais: resp.data.defaultPais,
            },
            "configuration"
          );

          setdatosEstaciones(data);
        } else {
          Alert.alert(
            "Información",
            "Hubo un problema al consultar la configuración opcional del usuario en el servidor"
          );
        }
      } catch (error) {
        Alert.alert(
          "Alerta",
          "Hubo un problema al consultar la configuración opcional del usuario en el servidor"
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert(
        "Información",
        "Debe Seleccionar un periodo fiscal para poder recargar la configuración"
      );
    }
  };

  const renderModalPeriodo = () => {
    return (
      <>
        <CustomAppBar
          rightIcon="close"
          center={true}
          bold={true}
          onRightPress={() => {
            setModalPeriodo(false);
          }}
          title={"PERIODO ACTIVO"}
        />
        <View style={[styles.contentModal, { paddingBottom: insets.bottom }]}>
          <SafeAreaView style={{ flex: 1 }}>
            {Object.keys(groupedData).map((key) => {
              return (
                <View key={key} style={{ paddingTop: 10 }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "#e6b31e",
                      fontSize: 15,
                    }}
                  >
                    &bull; {key}
                  </Text>
                  <View>
                    {groupedData[key].map((item, index) => {
                      return (
                        <CustomCheckBox
                          key={index}
                          checked={item.id === idPeriodoSelect}
                          onPress={() => setIdPeriodoSelect(item.id)}
                          title={item.nombre}
                        />
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </SafeAreaView>
          <View>
            <CustomButton
              label={"Guardar Periodo"}
              onPress={() => saveSelectedPeriodo()}
            />
          </View>
        </View>
      </>
    );
  };

  const renderModalEstacion = () => {
    return (
      <>
        <CustomAppBar
          rightIcon="close"
          center={true}
          bold={true}
          onRightPress={() => {
            setModalEstaciones(false);
          }}
          title={"Configuracion de Estaciones"}
        />
        <View style={[styles.contentModal, { paddingBottom: insets.bottom }]}>
          <SafeAreaView style={{ flex: 1 }}>
            {datosEstaciones.map((surtidor, index) => {
              const isSelected = selectedEstaciones.includes(surtidor.id);
              return (
                <CustomCheckBox
                  key={index}
                  checked={isSelected}
                  onPress={() => toggleSurtidorSelection(surtidor.id)}
                  title={surtidor.nombre}
                />
              );
            })}
          </SafeAreaView>
          <View>
            <CustomButton
              label={"Guardar Estaciones"}
              onPress={() => saveSelectedEstaciones()}
            />
          </View>
        </View>
      </>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal
        animationType={"slide"}
        navigationBarTranslucent={true}
        statusBarTranslucent={true}
        visible={modalPeriodo}
      >
        {renderModalPeriodo()}
      </Modal>
      <Modal
        animationType={"slide"}
        navigationBarTranslucent={true}
        statusBarTranslucent={true}
        visible={modalEstaciones}
      >
        {renderModalEstacion()}
      </Modal>
      <CustomAppBar
        leftIcon="menu"
        onLeftPress={() => navigation.openDrawer()}
        /*rightIcon={isDarkTheme ? "sunny" : "moon"}
        onRightPress={() => toggleTheme()}*/
        center={true}
        bold={true}
        title={"Configuracion"}
      />
      <Loader loading={isloading} />
      <View style={{ alignItems: "center" }}>
        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.box,
              pressed && sharedStyles.pressed,
            ]}
            onPress={() => setModalPeriodo(true)}
          >
            <FontAwesome name="building" color="#e6b31e" size={50} />
            <Text style={styles.buttonText}>Definir Periodo</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.box,
              pressed && sharedStyles.pressed,
            ]}
            onPress={() => refreshParametrizacionApp(respIdPeriodoSelect)}
          >
            <FontAwesome name="refresh" color="#e6b31e" size={50} />
            <Text style={styles.buttonText}>Recargar Parametrizacion</Text>
          </Pressable>
        </View>
      </View>
      <View style={{ alignItems: "center" }}>
        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.box,
              pressed && sharedStyles.pressed,
            ]}
            onPress={() => setModalEstaciones(true)}
          >
            <FontAwesome name="cogs" color="#e6b31e" size={50} />
            <Text style={styles.buttonText}>Configurar Estaciones</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: windowWidth - 25,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 20,
  },
  contentModal: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  box: {
    height: 125,
    width: 140,
    borderRadius: 20,
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "#000000",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#e6b31e",
    fontWeight: "bold",
    paddingTop: 10,
    fontSize: 13,
    textAlign: "center", // Centrar el texto horizontalmente
  },
});

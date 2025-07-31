import { DrawerContentScrollView } from "@react-navigation/drawer";
import React, { useEffect, useState } from "react";
import { Drawer, Text, useTheme } from "react-native-paper";
import useAuthStore from "../stores/AuthStore";
import { StyleSheet, View } from "react-native";
import LoginSVG from "../../assets/images/misc/logo_control.svg";
import { getToken } from "../utils/Utils";
import { getSocket } from "../utils/socket";

const DrawerComponent = (props) => {
  const theme = useTheme();
  const logout = useAuthStore((state) => state.logout);
  const useToken = useAuthStore((state) => state.userToken);
  const [usuario, setUsuario] = useState([]);

  useEffect(() => {
    async function handleLogout() {
      const data = await getToken("configuration");
      setUsuario(data.userData);
    }

    handleLogout();
  }, [useToken]);

  return (
    <DrawerContentScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: theme.colors.background,
      }}
      {...props}
    >
      <View style={{ padding: 0, margin: 0, width: "100%" }}>
        <View style={styles.header}>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 100,
              opacity: 0.8,
            }}
          >
            <LoginSVG height={100} width={100} />
          </View>
          <View style={{ justifyContent: "flex-start", marginTop: 5 }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ color: "white", fontWeight: "800" }}
            >
              {usuario.nombreCompleto}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ color: "white" }}
            >
              {usuario.username}
            </Text>
          </View>
        </View>
        <Drawer.Section>
          <Drawer.Item
            icon={"gas-station"}
            label="Inicio"
            active={props.state.index === 0}
            onPress={() => props.navigation.navigate("Home")}
          />
          <View style={{ height: 10 }} />
          <Drawer.Item
            icon={"cog"}
            label="Configuracion"
            active={props.state.index === 1}
            onPress={() => props.navigation.navigate("Configuration")}
          />
          <View style={{ height: 10 }} />
        </Drawer.Section>
      </View>
      <View>
        <Drawer.Section>
          <Drawer.Item
            icon={"logout"}
            label="Cerrar Sesion"
            onPress={() => {
              logout();
            }}
          />
        </Drawer.Section>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#e6b31e",
    marginTop: -4,
    marginBottom: 15,
    height: 200,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 10,
    padding: 0,
  },
});

export default DrawerComponent;

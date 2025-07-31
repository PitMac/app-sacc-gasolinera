import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  SafeAreaView,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { mergeStorage } from "../utils/Utils";
import Loader from "../components/Loader";
import LoginSVG from "../../assets/images/misc/logo_control.svg";
import CustomButton from "../components/CustomButton";
import axios from "axios";
import { TextInput } from "react-native-paper";
import { sharedStyles } from "../styles/SharedStyles";

export default function LicensedScreen() {
  const navigation = useNavigation();
  const [ruc, setRuc] = useState("");
  const [password, setPassword] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [seePassword, setSeePassword] = useState(false);

  const licensedAuth = async (data, token = "") => {
    const SERVER_URL = "https://sacc.sistemascontrol.ec";
    const formData = new URLSearchParams();
    formData.append("clave", data.clave);
    formData.append("ruc", data.ruc);
    formData.append("referencia", "GASOLINERA");

    const LICENSED_ENDPOINT = `${SERVER_URL}/api_control_identificaciones/public/licencia/obtener`;

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        Authorization:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjMzMjMwMDM5MTc3LCJhdWQiOiJkMTM5MjhlYzAwMDg4Nzg0ZWMyOTA5MWNmMWM4OWJiN2JlMzAwOGE2IiwiZGF0YSI6eyJ1c3VhcmlvSWQiOiIxIiwibm9tYnJlIjoiQ09OVFJPTCJ9fQ.JcCt-17CJa8KZLWK1BzetcgReAksrlHFXoDug0fNaVk",
        "Accept-X-Control-Y": "controlsistemasjl.com",
      },
    };

    try {
      const response = await axios.post(
        LICENSED_ENDPOINT,
        formData.toString(),
        config
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener licencia:", error);
      throw error;
    }
  };

  const handleLicensed = async () => {
    setIsLoading(true);

    if (ruc.trim() === "") {
      Alert.alert("Información", "Debe ingresar un RUC válido!");
      setIsLoading(false);
      return;
    }

    if (password.trim() === "") {
      Alert.alert(
        "Información",
        "Debe ingresar una contraseña, por favor verifique!"
      );
      setIsLoading(false);
      return;
    }

    const licensedData = {
      ruc: ruc.trim(),
      clave: password,
      referencia: "GASOLINERA",
    };

    try {
      const res = await licensedAuth(licensedData);

      if (res.statusCode === 200 && Object.keys(res.data).length > 0) {
        const url = res.data.ruta;
        const decodeUrl = url.replace(/\*/g, "/");
        const { client_id, client_password } = res.data;

        mergeStorage(
          {
            licensed: {
              route: decodeUrl,
              client_id,
              client_password,
            },
          },
          "configuration"
        );

        Alert.alert(
          "Confirmación",
          "Su licencia se validó de manera satisfactoria!",
          [{ text: "Ok", onPress: () => navigation.navigate("Login") }]
        );
      } else {
        Alert.alert(
          "Información",
          "Datos de licencia no válidos, por favor digite nuevamente!"
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Upps, ha ocurrido un error. Contacte con el administrador o verifique su conexión a internet."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <Loader loading={isloading} />
          <View style={{ paddingHorizontal: 15 }}>
            <View style={{ alignItems: "center" }}>
              <LoginSVG height={300} width={300} />
            </View>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "500",
                color: "#333",
                marginBottom: 20,
              }}
            >
              Obtener Licencia
            </Text>
            <TextInput
              label={"RUC del contribuyente"}
              autoCapitalize={"none"}
              mode={"outlined"}
              left={<TextInput.Icon icon="account-outline" />}
              value={ruc}
              onChangeText={setRuc}
              style={sharedStyles.textInput}
            />
            <View style={{ height: 5 }} />
            <TextInput
              label={"Contraseña"}
              autoCapitalize={"none"}
              mode={"outlined"}
              left={<TextInput.Icon icon="lock-outline" />}
              right={
                <TextInput.Icon
                  icon={seePassword ? "eye-off-outline" : "eye-outline"}
                  onPress={() => setSeePassword(!seePassword)}
                />
              }
              secureTextEntry={!seePassword}
              value={password}
              onChangeText={setPassword}
              style={sharedStyles.textInput}
            />
            <View style={{ height: 20 }} />
            <CustomButton
              label={"Verificar Licencia"}
              onPress={handleLicensed}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#495157" }}>
                ¿Ya activaste la licencia?
              </Text>
              <Pressable
                onPress={() => navigation.goBack()}
                style={({ pressed }) => [pressed && sharedStyles.pressed]}
              >
                <Text style={{ color: "#d5a203", fontWeight: "700" }}>
                  {" "}
                  Iniciar sesión
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

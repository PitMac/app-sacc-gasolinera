import AsyncStorage from "@react-native-async-storage/async-storage";

export const GASOLINERA_MODO_PRODUCCION_KEY = "sacc.gasolinera.modoProduccion";

/** true en Metro/debug; false en APK/AAB de release. */
export const isDevBuild = typeof __DEV__ !== "undefined" && __DEV__;

export async function loadModoProduccionDev() {
  if (!isDevBuild) {
    return true;
  }
  const stored = await AsyncStorage.getItem(GASOLINERA_MODO_PRODUCCION_KEY);
  return stored === "true";
}

export async function saveModoProduccionDev(activo) {
  await AsyncStorage.setItem(
    GASOLINERA_MODO_PRODUCCION_KEY,
    activo ? "true" : "false",
  );
}

/** true = no enviar comandos al surtidor (igual que !enviarComandosTransactor en web). */
export function isDesarrolloSinComandos(isDev, modoProduccionActivo) {
  if (!isDev) {
    return false;
  }
  return !modoProduccionActivo;
}

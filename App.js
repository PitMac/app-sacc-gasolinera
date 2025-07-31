import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./src/navigators/Navigator";
import {
  MD3LightTheme as DefaultTheme,
  MD3DarkTheme as DefaultDarkTheme,
  PaperProvider,
} from "react-native-paper";
import "react-native-gesture-handler";
import ModalOption from "./src/components/AlertOptionsComponent";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import useThemeStore from "./src/stores/ThemeStore";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#947415",
    secondary: "#947415",
    secondaryContainer: "#e6b31e",
    onSecondaryContainer: "white",
    onBackground: "#d5a200",
    background: "#f0f0f0",
  },
};

const darkTheme = {
  ...DefaultDarkTheme,
  colors: {
    ...DefaultDarkTheme.colors,
    primary: "#e6b31e", // amarillo fuerte
    secondary: "#947415",
    secondaryContainer: "#e6b31e",
    onSecondaryContainer: "black",
    background: "#1e1e1e", // gris oscuro profundo
    surface: "#2a2a2a", // para tarjetas/modales/etc.
    onBackground: "#f5f5f5", // texto claro
    onSurface: "#f5f5f5",
    outline: "#444", // líneas y bordes
  },
};

function App() {
  const isDarkTheme = useThemeStore((state) => state.isDarkTheme);
  const currentTheme = isDarkTheme ? darkTheme : theme;

  return (
    <PaperProvider theme={currentTheme}>
      <StatusBar
        barStyle={isDarkTheme ? "light-content" : "dark-content"}
        backgroundColor={currentTheme.colors.background}
      />
      <SafeAreaProvider>
        <ModalOption />
        <NavigationContainer theme={currentTheme}>
          <Navigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

export default App;

import { createDrawerNavigator } from "@react-navigation/drawer";
import ConfigurationScreen from "../screens/ConfigurationScreen";
import DrawerComponent from "../components/DrawerComponent";
import DynamicHomeScreen from "../screens/DynamicHomeScreen";
import { Colors } from "../utils/Colors";

const Drawer = createDrawerNavigator();

export default function AppStackNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerComponent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: Colors.primary,
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#333",
      }}
    >
      <Drawer.Screen
        options={{ headerShown: false }}
        name="Home"
        component={DynamicHomeScreen}
      />
      <Drawer.Screen
        options={{ headerShown: false }}
        name="Configuration"
        component={ConfigurationScreen}
      />
    </Drawer.Navigator>
  );
}

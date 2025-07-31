import { createDrawerNavigator } from "@react-navigation/drawer";
import ConfigurationScreen from "../screens/ConfigurationScreen";
import DrawerComponent from "../components/DrawerComponent";
import DynamicHomeScreen from "../screens/DynamicHomeScreen";

const Drawer = createDrawerNavigator();

export default function AppStackNavigator() {
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerComponent {...props} />}>
      <Drawer.Screen options={{ headerShown: false }} name="Home" component={DynamicHomeScreen} />
      <Drawer.Screen options={{ headerShown: false }} name="Configuration" component={ConfigurationScreen} />
    </Drawer.Navigator>
  );
}

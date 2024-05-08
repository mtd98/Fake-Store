import { useState, useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import SplashScreen from "./src/screens/SplashScreen";
import CategoryScreen from "./src/screens/CategoryScreen";
import ProductList from "./src/screens/ProductList";
import ItemDetails from "./src/screens/ItemDetails";

const Stack = createStackNavigator();

export default function App() {
  
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAppIsReady(true);
    }, 6000);
  }, []);

  if (!appIsReady) {
    return <SplashScreen/>;
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="CategoryScreen">
          <Stack.Screen name="CategoryScreen" component={CategoryScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="ProductList" component={ProductList} options={{ headerShown: false }}/>
          <Stack.Screen name="ItemDetails" component={ItemDetails} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

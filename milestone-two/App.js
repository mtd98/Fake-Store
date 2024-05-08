import { useState, useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import SplashScreen from "./src/screens/SplashScreen";
import CategoryScreen from "./src/screens/CategoryScreen";
import ProductList from "./src/screens/ProductList";
import ItemDetails from "./src/screens/ItemDetails";
import ShoppingCart from "./src/screens/ShoppingCart";

import { Icon } from './src/components/Icon';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const cartItemCount = 1;
  
  const Products = () => (
    <Stack.Navigator initialRouteName="CategoryScreen">
      <Stack.Screen name="CategoryScreen" component={CategoryScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="ProductList" component={ProductList} options={{ headerShown: false }}/>
      <Stack.Screen name="ItemDetails" component={ItemDetails} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );

  const MyTabNavigator = () => (
    <Tab.Navigator 
      tabBarOptions={{
        activeTintColor: 'blue', 
        inactiveTintColor: 'gray',
        style: {
          backgroundColor: 'white',
        },
        labelStyle: {
          fontSize: 16,
        },
      }}
    >
      <Tab.Screen name="Products" component={Products} 
        options={{ 
          headerShown: false, 
          tabBarIcon: () => (
            <Icon name="backspace-outline"/>
          ),
        }}
      />
      <Tab.Screen name="My Cart" component={ShoppingCart} 
        options={{ 
          headerShown: false,
          tabBarBadge: cartItemCount > 0 ? `${cartItemCount}` : null,
          tabBarIcon: () => (
            <Icon name="cart-outline" fun={() => navigation.navigate('My Cart')} />
          ),
        }}
      />
    </Tab.Navigator>
  );

  useEffect(() => {
    setTimeout(() => {
      setAppIsReady(true);
    }, 1000);
  }, []);

  if (!appIsReady) {
    return <SplashScreen/>;
  } else {
    return (
      <NavigationContainer>
        <MyTabNavigator/>
      </NavigationContainer>
    );
  }
}

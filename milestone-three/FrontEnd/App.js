import { useState, useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider, useSelector } from "react-redux";

import SplashScreen from "./src/screens/SplashScreen";
import CategoryScreen from "./src/screens/CategoryScreen";
import ProductList from "./src/screens/ProductList";
import ItemDetails from "./src/screens/ItemDetails";
import ShoppingCart from "./src/screens/ShoppingCart";
import OrderScreen from "./src/screens/OrderScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import SignInScreen from "./src/screens/SignInScreen";
import ProfileScreen from "./src/screens/ProfileScreen"

import { Icon } from './src/components/Icon';
import store from './src/components/Store';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Products = () => (
  <Stack.Navigator initialRouteName="CategoryScreen">
    <Stack.Screen name="CategoryScreen" component={CategoryScreen} options={{ headerShown: false }}/>
    <Stack.Screen name="ProductList" component={ProductList} options={{ headerShown: false }}/>
    <Stack.Screen name="ItemDetails" component={ItemDetails} options={{ headerShown: false }}/>
  </Stack.Navigator>
);

const MyTabNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try { 

    } catch (error) {
      console.error('Error with Login Status', error);
    }
  };

  const totalItems = useSelector(state => state.cart.totalItems);
  const totalOrders = 1;
  return ( 
    <Tab.Navigator initialRouteName="User Profile"
      screenOptions={{
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
            <Icon name="basket-outline" />
          ),
        }}
      />
      <Tab.Screen name="My Cart" component={ShoppingCart} 
        options={{ 
          headerShown: false,
          tabBarBadge: totalItems > 0 ? `${totalItems}` : null,
          tabBarIcon: () => (
            <Icon name="cart-outline" />
          ),
        }}
        lazy={true}
        unmountOnBlur={true}
      />
      <Tab.Screen name="My Orders" component={OrderScreen} 
        options={{ 
          headerShown: false,
          tabBarBadge: totalOrders > 0 ? `${totalOrders}` : null,
          tabBarIcon: () => (
            <Icon name="gift-outline" />
          ),
        }}
        lazy={true}
        unmountOnBlur={true}
      />
      <Tab.Screen name="User Profile" component={isLoggedIn ? ProfileScreen: SignInScreen} 
        options={{ 
          headerShown: false,
          tabBarIcon: () => (
            <Icon name="person-outline" />
          ),
        }}
        lazy={true}
        unmountOnBlur={true}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <MyTabNavigator/>
    </NavigationContainer>
  )
};

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAppIsReady(true);
    }, 1000);
  }, []);

  if (!appIsReady) {
    return <SplashScreen/>;
  } else {
    return (
      <Provider store={store}>
        <AppNavigator/>
      </Provider>
    );
  }
};
export default App;

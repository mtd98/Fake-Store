import { useState, useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider, useDispatch, useSelector } from "react-redux";

import store, { fetchCart, fetchOrders, setCart } from './src/components/Store';
import { Icon } from './src/components/Icon';
import CustomModal from "./src/components/Modal";

import SplashScreen from "./src/screens/SplashScreen";
import CategoryScreen from "./src/screens/CategoryScreen";
import ProductList from "./src/screens/ProductList";
import ItemDetails from "./src/screens/ItemDetails";
import ShoppingCart from "./src/screens/ShoppingCart";
import OrderScreen from "./src/screens/OrderScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import SignInScreen from "./src/screens/SignInScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Products = () => (
  <Stack.Navigator initialRouteName="CategoryScreen">
    <Stack.Screen name="CategoryScreen" component={CategoryScreen} options={{ headerShown: false }}/>
    <Stack.Screen name="ProductList" component={ProductList} options={{ headerShown: false }}/>
    <Stack.Screen name="ItemDetails" component={ItemDetails} options={{ headerShown: false }}/>
  </Stack.Navigator>
);

const Profile = () => (
  <Stack.Navigator initialRouteName='SignInScreen'>
    <Stack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false }}/>
    <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }}/>
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }}/>
  </Stack.Navigator>
);

const MyTabNavigator = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const userToken = useSelector((state) => state.user.token);
  const totalItems = useSelector((state) => state.cart.cartItems.reduce((total, item) => total + Number(item.quantity), 0));
  const totalNewOrders = useSelector((state) => state.order.totalNewOrders);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedTab, setSelectedTab ] = useState('SignInScreen');
 
  useEffect(() => {
    if (isLoggedIn && userToken) {
      dispatch(fetchOrders(userToken));
    };
    const loadCart = async () => {
      if (isLoggedIn){
        try {
          const cartData = await dispatch(fetchCart(userToken)).unwrap();
          dispatch(setCart(cartData.items));
        } catch (error) {
          console.log('Failed to load cart', error);
        }
      }
    };
    loadCart();
  }, [isLoggedIn, userToken]);
  
  return ( 
    <> 
      <Tab.Navigator initialRouteName="User Profile" screenOptions={{activeTintColor: 'blue', inactiveTintColor: 'gray', style: {backgroundColor: 'white'}, labelStyle: {fontSize: 18}}} 
        screenListeners={({ navigation }) => ({
          tabPress: (e) => { 
            const tabName = e.target;
            if (!isLoggedIn && tabName !== 'User Profile') {
              navigation.navigate('User Profile');
              setPopupVisible(true);
              setSelectedTab(tabName);
              e.preventDefault();
            }
          },
        })}
      >
        <Tab.Screen name="Products" component={Products} options={{headerShown: false, tabBarIcon: () => (<Icon name="basket-outline"/>)}}/>
        <Tab.Screen name="My Cart" component={ShoppingCart} options={{headerShown: false, tabBarBadge: totalItems > 0 ? `${totalItems}` : null, tabBarIcon: () => (<Icon name="cart-outline" />)}}/>
        <Tab.Screen name="My Orders" component={OrderScreen} options={{headerShown: false, tabBarBadge: totalNewOrders > 0 ? `${totalNewOrders}` : null, tabBarIcon: () => (<Icon name="gift-outline" />)}}/>
        <Tab.Screen name="User Profile" component={isLoggedIn ? ProfileScreen: Profile} options={{ headerShown: false, tabBarIcon: () => (<Icon name="person-outline" />)}}/> 
      </Tab.Navigator>
      <CustomModal isVisible={isPopupVisible} onClose={() => setPopupVisible(false)} message={"Please log in or sign up to access this page"} />
    </>
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
    }, 3000);
  }, []);

  if (!appIsReady) {
    return <SplashScreen/>
  } else {
    return (
      <Provider store={store}>
        <AppNavigator/>
      </Provider>
    );
  }
};

export default App;

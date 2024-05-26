import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { backgroundColour, buttonColour, mainComponentColour, textColour, secondaryTextColour, borderColour } from '../constants/Color';
import { fetchOrders } from '../components/Store';
import { IconButton } from "../components/IconButton";
import CustomModal from "../components/Modal";

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === 'web';

const MyOrdersScreen = () => {
  const dispatch = useDispatch();
  const userToken = useSelector(state => state.user.token);
  const userId = useSelector(state => state.user.id);
  const orders = useSelector(state => state.order.orders);

  const [expandedSections, setExpandedSections] = useState({
    newOrders: false,
    paidOrders: false,
    deliveredOrders: false,
  });
  const [expandedItems, setExpandedItems] = useState({});
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    //console.log("Fetching orders...");
    if (userToken) {
      dispatch(fetchOrders(userToken));
    } 
  }, [userToken, dispatch]);

  useEffect(() => {
    //console.log("Orders updated:", orders);
  }, [orders]);

  const toggleSection = (section) => {
    setExpandedSections(prevState => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  const toggleExpand = (itemId) => {
    setExpandedItems(prevState => ({
      ...prevState,
      [itemId]: !prevState[itemId]
    }));
  };

  const handleUpdate = async (orderId, isPaid, isDelivered) => {
    try {
      const response = await fetch('http://192.168.0.149:3000/orders/updateorder', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ orderID: orderId, isPaid, isDelivered }),
      });
      if (response.ok) {
        console.log("Updated order")
        dispatch(fetchOrders(userToken));
        let message = '';
        if (isPaid && isDelivered) {
          message = 'Your order is delivered';
        } else if (isPaid) {
          message = 'Your order is paid';
        } else if (isDelivered) {
          message = 'Your order status updated to delivered';
        }
        setPopupVisible(true);
        setMessage(message);
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const renderOrderItem = ({ item }) => {
    const orderItems = JSON.parse(item.order_items);
    const numberOfItems = orderItems.reduce((total, orderItem) => total + orderItem.quantity, 0);
    const totalPrice = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    if (item.uid === userId) {
      return (
      <View style={styles.orderItemContainer}>
        <View style={styles.orderItemHeader}>
          <View style={styles.orderDetails}>
            <Text style={styles.orderItemTitle}>{`Order ID: ${item.id}`}</Text>
            <Text>{`Number of Items: ${numberOfItems}`}</Text>
            <Text>{`Total Price: $${totalPrice.toFixed(2)}`}</Text>
          </View>
          <View style={styles.orderActions}>
            <IconButton name="expand" fun={() => toggleExpand(item.id)}/>
            {!item.is_paid && !item.is_delivered && (
              <IconButton name="cash-outline" text="Pay" fun={() => handleUpdate(item.id, true, false)} />
            )}
            {item.is_paid && !item.is_delivered && (
              <IconButton name="checkmark-done-outline" text="Receive" fun={() => handleUpdate(item.id, true, true)} />
            )}
          </View>
        </View>
        {expandedItems[item.id] && (
          <View style={styles.orderDetailsExpanded}>
           {orderItems.map((orderItem, index) => (
              <View key={index} style={styles.itemContainer}>
                <Image style={styles.itemImage} source={{uri: orderItem.image}} />
                <View style={styles.itemDetails}>
                  <Text>{orderItem.title}</Text>
                  <Text>{`Price: $${orderItem.price}`}</Text>
                  <Text>{`Quantity: ${orderItem.quantity}`}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
      );
    } else {
      return null;
    }
  };

  const newOrders = orders.filter((order) => order && !order.is_paid && !order.is_delivered);
  const paidOrders = orders.filter((order) =>  order && order.is_paid && !order.is_delivered);
  const deliveredOrders = orders.filter((order) =>  order && order.is_paid && order.is_delivered);

  return (
    <View style={styles.container}>
      <CustomModal isVisible={isPopupVisible} onClose={() => setPopupVisible(false)} message={message} />
      <Text style={styles.screenTitle}>My Orders</Text>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>New Orders ({newOrders.length})</Text>
        <IconButton name={expandedSections.newOrders ? "chevron-up-outline" : "chevron-down-outline"} fun={() => toggleSection('newOrders')}/>
      </View>
      {expandedSections.newOrders && (
        <FlatList data={newOrders} renderItem={renderOrderItem} keyExtractor={order => order.id.toString()}/>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Paid Orders ({paidOrders.length})</Text>
        <IconButton name={expandedSections.paidOrders ? "chevron-up-outline" : "chevron-down-outline"} fun={() => toggleSection('paidOrders')}/>
      </View>
      {expandedSections.paidOrders && (
        <FlatList data={paidOrders} renderItem={renderOrderItem} keyExtractor={order => order.id.toString()}/>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Delivered Orders ({deliveredOrders.length})</Text>
        <IconButton name={expandedSections.deliveredOrders ? "chevron-up-outline" : "chevron-down-outline"} fun={() => toggleSection('deliveredOrders')}/>
      </View>
      {expandedSections.deliveredOrders && (
        <FlatList data={deliveredOrders} renderItem={renderOrderItem} keyExtractor={order => order.id.toString()}/>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: backgroundColour,
  },
  screenTitle: {
    fontSize: isWeb ? 34 : width * 0.07,
    fontWeight: 'bold',
    color: textColour,
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: mainComponentColour,
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  sectionTitle: {
    fontSize: isWeb ? 28 : width * 0.05,
    fontWeight: 'bold',
    color: textColour,
  },
  orderItemContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: borderColour,
    borderWidth: 1,
  },
  orderItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderDetails: {
    flex: 1,
  },
  orderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderItemTitle: {
    fontSize: isWeb ? 24 : width * 0.045,
    fontWeight: 'bold',
    color: secondaryTextColour,
  },
  orderDetailsExpanded: {
    marginTop: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  itemImage: {
    width: isWeb ? 100 : width * 0.2,
    height: isWeb ? 100 : width * 0.2,
    borderRadius: 5,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonText: {
    color: textColour,
    fontSize: isWeb ? 18 : width * 0.04,
    fontWeight: 'bold',
  },
});

export default MyOrdersScreen;
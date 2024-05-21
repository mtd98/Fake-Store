import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

import { IconButton } from "../components/IconButton";
import CustomModal from "../components/Modal";

const MyOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const userToken = useSelector(state => state.user.token);
  const userId = useSelector(state => state.user.id);

  const [expandedSections, setExpandedSections] = useState({
    newOrders: false,
    paidOrders: false,
    deliveredOrders: false,
  });
  const [expandedItems, setExpandedItems] = useState({});
  
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

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

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://192.168.0.149:3000/orders/all', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      });
      const responseData = await response.json();
      //console.log(responseData);
      setOrders(responseData.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
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
        fetchOrders();
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
    const numberOfItems = orderItems.length;
    const totalPrice = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    if (item.uid === userId) {
      return (
      <View style={styles.orderItemContainer}>
        <View>
          <Text style={styles.orderItemTitle}>{`Order ID: ${item.id}`}</Text>
          <Text>{`Number of Items: ${numberOfItems}`}</Text>
          <Text>{`Total Price: $${totalPrice}`}</Text>
          <IconButton name="expand" fun={() => toggleExpand(item.id)}/>
          {!item.is_paid && !item.is_delivered && (
            <IconButton name="cash-outline" fun={() => handleUpdate(item.id, true, false)} />
          )}
          {item.is_paid && !item.is_delivered && (
            <IconButton name="checkmark-done-outline" fun={() => handleUpdate(item.id, true, true)} />
          )}
        </View>
        {expandedItems[item.id] && (
          <View>
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
      return (
        <Text>No Orders Found</Text>
      );
    }
  };

  const newOrders = orders.filter(order => !order.is_paid && !order.is_delivered);
  const paidOrders = orders.filter(order => order.is_paid && !order.is_delivered);
  const deliveredOrders = orders.filter(order => order.is_paid && order.is_delivered);

  return (
    <View style={styles.container}>
      <CustomModal isVisible={isPopupVisible} onClose={() => setPopupVisible(false)} message={message} />
      <Text style={styles.screenTitle}>My Orders</Text>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>New Orders</Text>
        <IconButton name={expandedSections.newOrders ? "chevron-up-outline" : "chevron-down-outline"} fun={() => toggleSection('newOrders')}/>
      </View>
      {expandedSections.newOrders && (
        <FlatList data={newOrders} renderItem={renderOrderItem} keyExtractor={order => order.id.toString()}/>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Paid Orders</Text>
        <IconButton name={expandedSections.paidOrders ? "chevron-up-outline" : "chevron-down-outline"} fun={() => toggleSection('paidOrders')}/>
      </View>
      {expandedSections.paidOrders && (
        <FlatList data={paidOrders} renderItem={renderOrderItem} keyExtractor={order => order.id.toString()}/>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Delivered Orders</Text>
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
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  orderItemContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  orderItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderItemStatus: {
    fontSize: 14,
    marginBottom: 5,
  },
  orderItemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  image: {
    width: 100,
    aspectRatio: 1,
    marginRight: 10,
    borderRadius: 5,
  },
});

export default MyOrdersScreen;
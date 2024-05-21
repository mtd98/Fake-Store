import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';


import { IconButton } from "../components/IconButton";
const MyOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const userToken = useSelector(state => state.user.token);
  const userId = useSelector(state => state.user.id);

  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

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
                {console.log("Image URL:", orderItem.image)}
              </View>
            ))}
          </View>
        )}
      </View>
      );
    } else {
      return (
        <Text>No Orders</Text>
      );
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>My Orders</Text>
      <Text style={styles.sectionTitle}>New Orders</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={order => order.id.toString()}
      />
      <Text style={styles.sectionTitle}>Paid Orders</Text>
      <Text style={styles.sectionTitle}>Delivered Orders</Text>
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
import React, { useEffect } from 'react';
import { Button, View, StyleSheet } from 'react-native';

const ws = new WebSocket('ws://192.168.68.201:5000/ws');

ws.onopen = () => {
  console.log('Connected to WebSocket server');
};
ws.onopen = () => {
  console.log('WebSocket connected!');
  ws.send(JSON.stringify({ msg: 'Handshake' }));
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onmessage = (e) => {
  try {
    const jsonMessage = JSON.parse(e.data);
    console.log('Response received:', jsonMessage);
  } catch (error) {
    console.error('Error parsing message:', error);
  }
};

const WlanController: React.FC = (): React.ReactElement => {
  const sendMessage = () => {
    try {
      const message = JSON.stringify({ topic: '/flask/mqtt', msg: 'Hello from React Native' });
      ws.send(message);
      console.log('Message sent:', message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    // WebSocket connection is already opened in the global scope
    return () => {
      ws.close();
      console.log('WebSocket closed');
    };
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Send Message" onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WlanController;
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import A from 'react-native-reanimated';
import UserModal from './UserModal';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.container}>
      <Button
        style={{
          backgroundColor: 'white',
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
        title={'open modal'}
        onPress={() => {
          setModalVisible(!modalVisible);
        }}
      />
      <UserModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#71a2b6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

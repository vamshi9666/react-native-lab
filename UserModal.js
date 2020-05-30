import React, { Fragment, memo } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');
import Interactable from './Interactable';
import asModal from './ModalHoc';
const UserModal = memo((props) => {
  return <View style={styles.container}></View>;
});

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 300,
    borderRadius: 10,
    backgroundColor: 'red',
  },
});
export default asModal(UserModal);

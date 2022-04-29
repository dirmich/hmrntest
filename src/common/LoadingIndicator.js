import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';

const LoadingIndicator = props => {
  return (
    <View style={{...styles.container}}>
      <ActivityIndicator size="large" color="#eb9d1f" />
    </View>
  );
};

export default LoadingIndicator;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'white',
    opacity: 0.8,
  },
});

import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,                    
    justifyContent: 'center',  
    alignItems: 'center',     
    paddingTop: 40, 
  },
  imageCard: { 
    width: 900,
    height: 500,
    borderRadius: 25, 
    overflow: 'hidden',
  },
});

const DisplayAnImage = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.imageCard} 
        source={{ uri: 'https://wallpapercave.com/wp/wp9637279.jpg' }}
      />
    </View>
  );
};

export default DisplayAnImage;

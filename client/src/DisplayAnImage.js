import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingLeft: 0,
  },
  tinyLogo: {
    width: 600,
    height: 500,
    class:"center",
  },
  
});

const DisplayAnImage = () => {
  return (
    <View style={styles.container}>
      
      <Image
        style={styles.tinyLogo} class="center" 
        source={{
          uri: 'https://wallpapercave.com/wp/wp9637279.jpg',
        }}
      />
      
    </View>
  );
};

export default DisplayAnImage;

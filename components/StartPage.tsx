import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import {  Button, TextInput } from 'react-native-paper';
import { useContext,  useMemo, useRef, useState } from 'react';




const StartPage : React.FC = () : React.ReactElement => {
    return (<><Text style={styles.headline}>Hi. My app contains few features:</Text>
                <View style={styles.container}>
        <Image
            style={styles.image}
            source={require('../img/cloud.jpg')} />
    </View>
    <Text style={styles.title}>Forecast app. There you can search forecast based on devices location or search word. References: cloud by pixabay ArtisticOperations</Text>
    <View style={styles.container}>
        <Image
            style={styles.image}
            source={require('../img/camera.jpg')} />
    </View>
    <Text style={styles.title}>Camera app. Yopu can take photos and give then wanted name and description. Also location will be saved on pictures. References: camera by pixabay geralt</Text>
    <View style={styles.container}>
        <Image
            style={styles.image}
            source={require('../img/map.png')} />
    </View>
    <Text style={styles.title}>Gps tracker. This app will save the location and speed when you are moving and shows avarage speed and distance. References: map by pixabay tumisu</Text>
    </>
)
}


const styles = StyleSheet.create({
  
  
    container: {
      flex: 1,
      justifyContent: 'center',
       alignItems: 'center',
    },
   
    image: {
      width: 320,
      height: 420,
      margin: 10,
      resizeMode: 'stretch'
    },
   
    title: {
      fontWeight: 'bold',
      marginVertical: 4,
      margin:15
    },
    headline : {
      fontWeight: 'bold',
      marginVertical: 4,
      margin:15,
      fontSize : 25
    }
  });
  







export default StartPage;
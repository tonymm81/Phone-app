import { StatusBar } from 'expo-status-bar';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MenuView } from '@react-native-menu/menu';
import { Button, Menu, Divider, PaperProvider, Provider, Appbar } from 'react-native-paper';
import React, { useState } from 'react';
import Forecast from './components/Forecast';
import Photo from './components/Photo';
import Tracker from './components/Tracker';
import StartPage from './components/StartPage';




export default function App() {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const [chooseStartView, setChooseStartView] = useState<boolean>(true)
  const [chooseForecastView, setChooseForecastView] = useState<boolean>(true)
  const [choosePhotosView, setChoosePhotosView] = useState<boolean>(true)

  const whereShallWeNavigate = (thePath : string) : void =>{
    if (thePath === "forecast"){
      setChooseForecastView(false)
      setChooseStartView(true)
      console.log("fore")
    }
    if(thePath === "startview"){
      console.log("starrrrt")
      setChooseForecastView(true)
      setChooseStartView(true)

    }
    if (thePath === "photos"){
      console.log("photo")
      setChooseStartView(false)
      
      setChoosePhotosView(true)
    }
    if (thePath === "tracker"){
      console.log("track")
      setChooseStartView(false)
      
      setChoosePhotosView(false)

    }
  }

  return (
    
    <Provider>
   <Appbar.Header>
      <Appbar.Content title="Just a phone app" />
      </Appbar.Header>
    <View style={styles.mainScroll}>
     <PaperProvider>
      <View
        style={styles.mainMenu}>
        <Menu
           style={styles.menuStyles}
          visible={visible}
          onDismiss={closeMenu}
          anchor={<Button onPress={openMenu}>Show menu</Button>}>
            
           <Menu.Item onPress={() => whereShallWeNavigate("startview")} title="Go home page" key="1"/>
            <Menu.Item onPress={() => whereShallWeNavigate("forecast")} title="Go forecast view" key="2"/>
            <Menu.Item onPress={() => whereShallWeNavigate("photos")} title="Go photos" key="3"/>
            <Menu.Item onPress={() => whereShallWeNavigate("tracker")} title="Go gps tracker" key="4" />
            
         
          
        </Menu>
      </View>
    </PaperProvider>
      <StatusBar style="auto" />
    </View>
    <ScrollView>
      {chooseStartView ? 
      chooseForecastView ?
          <StartPage/>  
              : 
          <Forecast/>
      : 
      choosePhotosView ?
                      <Photo/>
                         :   
                         <Tracker/> }

    </ScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  menuStyles : {
    minHeight: "50%"
  },
  mainMenu : {
    paddingTop: 50,
    marginRight : "50%",
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: "50%"
  },
  mainScroll : {
    minHeight : "50%",
    alignItems : "center"
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

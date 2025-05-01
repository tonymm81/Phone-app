import { StatusBar } from 'expo-status-bar';
import { Modal, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MenuView } from '@react-native-menu/menu';
import { Button, Menu, Divider, PaperProvider, Provider, Appbar } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import Forecast from './components/Forecast';
import Photo from './components/Photo';
import Tracker from './components/Tracker';
import StartPage from './components/StartPage';
import { JustAppProvider } from './context/JustAppContext';
import 'react-native-reanimated';
import WlanController from './components/WlanController';


export default function App() {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const [chooseStartView, setChooseStartView] = useState<boolean>(true)
  const [chooseForecastView, setChooseForecastView] = useState<boolean>(true)
  const [choosePhotosView, setChoosePhotosView] = useState<boolean>(true)
  const [chooseWlanControlView, setChooseWlanControlView] = useState<boolean>(true)
 

  const whereShallWeNavigate = (thePath: string): void => {// here is aaplication navigate

    if (thePath === "forecast") {
      setChooseForecastView(false)
      setChooseStartView(true)
      closeMenu()

      console.log("fore")
    }
    if (thePath === "startview") {
      console.log("starrrrt")
      setChooseForecastView(true)
      setChooseStartView(true)
      closeMenu()

    }
    if (thePath === "photos") {
      console.log("photo")
      setChooseStartView(false)

      setChoosePhotosView(true)
      closeMenu()
    }
    if (thePath === "WlanController") {
      setChooseStartView(false)
      setChooseWlanControlView(false)
      setChoosePhotosView(false)
      closeMenu()
    }
    if (thePath === "tracker") {
      console.log("track")
      setChooseStartView(false)

      setChoosePhotosView(false)
      closeMenu()

    }
  }

  return (

    <Provider>
      <JustAppProvider>
        <Appbar.Header style={styles.header}>
          <Appbar.Content title="Just a phone app" />
        </Appbar.Header>
       
        <View style={styles.mainScroll}>

          <PaperProvider>

            <View
            >
              <Menu
                style={styles.menuStyles}
                statusBarHeight={150}
                visible={visible}
                onDismiss={closeMenu}
                anchorPosition="top"
                anchor={<Button onPress={openMenu}
                >Show menu</Button>}>

                <Menu.Item onPress={() => whereShallWeNavigate("startview")}
                  title="Go home page"
                  key="1"
                  leadingIcon="undo" />
                <Menu.Item onPress={() => whereShallWeNavigate("forecast")}
                  title="Go forecast view"
                  key="2"
                  leadingIcon="cloud" />
                <Menu.Item onPress={() => whereShallWeNavigate("photos")}
                  title="Go photos"
                  key="3"
                  leadingIcon="camera" />
                <Menu.Item onPress={() => whereShallWeNavigate("tracker")}
                  title="Go gps tracker"
                  key="4"
                  leadingIcon="crosshairs-gps" />
                 <Menu.Item onPress={() => whereShallWeNavigate("WlanController")}
                  title="Control wlan devices"
                  key="4"
                  leadingIcon="biohazard" />


              </Menu>
            </View>

          </PaperProvider>


          <StatusBar style="auto" />
        </View>
        <ScrollView>
          {chooseStartView ?
            chooseForecastView ?
              <StartPage />
              :
              <Forecast />
            :
            choosePhotosView ?
              <Photo />
              :
              chooseWlanControlView ? <Tracker /> 
              : <WlanController/> 
            }

        </ScrollView>
      </JustAppProvider>
    </Provider>
    
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: "center",
    backgroundColor: "blue",
    margin: 5
  },
  menuStyles: {
    /*height: "auto",
    width:"50%",
    margin:10,*/
    backgroundColor: "#222",
    borderWidth: 2,
    top: 40,
    left: -100,
    position: 'absolute',
    zIndex: 100
    // backgroundColor: "#222",

  },

  mainMenu: {
    /*flex : 1,
    paddingTop: 50,
    marginRight : "50%",
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: "auto",
    backgroundColor : "green",*/
    height: 150,

    width: "100%"
  },
  mainScroll: {
    zIndex: 100,
    minHeight: "10%",
    height: "auto",

    padding: 5,
    alignItems: "center"
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

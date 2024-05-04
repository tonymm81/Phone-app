import { StyleSheet, Text, View, Image, ScrollView, StatusBar, Modal } from 'react-native';
import {  Appbar, Button, Dialog, FAB, Portal, Provider, TextInput } from 'react-native-paper';
import { useContext,  useEffect,  useMemo, useRef, useState } from 'react';
import { JustAppContext, Photos } from '../context/JustAppContext';
import { Camera } from 'expo-camera';




const Photo : React.FC = () : React.ReactElement => {
    
    const texthandler = useRef("")
    const texthandlerHeadliner = useRef("")
    const {
            cameraRef,
            info,
            takePhoto,
            setOpenCamera,
            startTheCamera,
            openCamera,
            savePhotoToDb,
            showDialogPhoto,
            setShowDialogPhoto,
            getPhotosDb,
            photosFromDb
                            } = useContext(JustAppContext);
    const [showListGraphics, setShowListGraphics] = useState<boolean>(false)

    const handleInputPhoto = (input : string):void =>{
      texthandler.current = input
    }
    
    const handleInputPhotoHeadline = (input : string):void =>{
      texthandler.current = input
    }
    useEffect(() => {
      getPhotosDb()
      if (photosFromDb.length > 0){
        setShowListGraphics(true)
      }else{
        setShowListGraphics(false)
      }

  }, []);

    return ( (openCamera) ?
        
      
    <View style={styles.container}>
      <Portal>
      <Camera style={styles.kuvaustila} ref={cameraRef } onMountError={()=>alert("ei")}>

      {(Boolean(info))
          ? <View><Text style={{ color: "#fff" }}>{info}</Text></View>
          : <View><Text></Text></View>}

        <FAB
          style={styles.nappiOtaKuva}
          icon="camera"
          label=""
          onPress={takePhoto} />

        <FAB
          style={styles.nappiSulje}
          icon="close"
          label=""
          onPress={() => setOpenCamera(false)} />

      </Camera></Portal>
       </View> :
      
      
        <><Button style={{ marginTop: 20 }}
        mode="contained"
        icon="camera"
        onPress={() => startTheCamera()}>Take a new photo
      </Button>
      {showListGraphics ? <Text>Photos from device</Text>
      
      
      
      : <Text>No photos, start to add some</Text>}
      <Portal>
          <Dialog
            visible={showDialogPhoto}
            onDismiss={() => setShowDialogPhoto(false)}
          >
            <Dialog.Title>Add photo title</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="headline"
                mode="outlined"
                placeholder='Type name of headline'
                onChangeText={(nex_textheadline: string) => handleInputPhotoHeadline(nex_textheadline)} />
                 <TextInput
                label="imagetext"
                mode="outlined"
                placeholder='Type image text'
                onChangeText={(nex_text: string) => handleInputPhoto(nex_text)} />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => savePhotoToDb(texthandler.current, texthandlerHeadliner.current)}>save</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal></>
        

        )
}

const styles = StyleSheet.create({
  tekstit: {
    padding: 10,
    margin: 10
  },
  container: {
    //flex: 1,
    //justifyContent: 'center',
    // alignItems: 'center',
  },
  kuvaustila: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  nappiSulje: {
    position: 'absolute',
    margin: 20,
    bottom: 0,
    right: 0

  },
  nappiUusikuva: {
    position: 'absolute',
    margin: 20,
    top: 0,
    right: 0
  },
  nappipoista: {
    position: 'absolute',
    margin: 20,
    bottom: 0,
    left: 0
  },
  nappiOtaKuva: {
    position: 'absolute',
    margin: 20,
    bottom: 0,
    left: 0
  },
  kuva: {
    width: 320,
    height: 420,
    margin: 10,
    resizeMode: 'stretch'
  },
  kuvascroll: {
    marginBottom: 80,
    padding: 20,
  },
  infootsikko: {
    margin: 20
  },


});


export default Photo;
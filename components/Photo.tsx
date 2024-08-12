import { StyleSheet, Text, View, Image, ScrollView, StatusBar, Modal } from 'react-native';
import {  Appbar, Button, Dialog, FAB, List, Portal, Provider, TextInput } from 'react-native-paper';
import { useContext,  useEffect,  useMemo, useRef, useState } from 'react';
import { JustAppContext, Photos } from '../context/JustAppContext';
import { Camera, CameraView } from 'expo-camera';
import React from 'react';




const Photo : React.FC = () : React.ReactElement => {
    
    const texthandler = useRef("")
    const texthandlerHeadliner = useRef("")
    const deleteHandler = useRef(0)
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
            photosFromDb,
            deletePhoto,
            showDialogdelete,
            setShowDialogdelete
                            } = useContext(JustAppContext);
    const [showListGraphics, setShowListGraphics] = useState<boolean>(false)

    const handleInputPhoto = (input : string):void =>{
      texthandler.current = input
    }
    
    const handleInputPhotoHeadline = (input : string):void =>{
      texthandlerHeadliner.current = input
    }
    const saveDeleteImageIndex =(indexImg : number) : void =>{
      deleteHandler.current = indexImg
      setShowDialogdelete(true)

    }
    useEffect(() => {
      getPhotosDb()
      if (photosFromDb.length > 0){
        setShowListGraphics(true)
      }else{
        getPhotosDb()
        if (photosFromDb.length > 0){
          setShowListGraphics(true)
        }else{
          if (photosFromDb.length === 0){
           getPhotosDb()   
          }
          if (photosFromDb.length > 0){
            setShowListGraphics(true)
          }else{
          setShowListGraphics(false)
          }
        }
      }
      //console.log("photos in client", photosFromDb)

  }, []);

    return ( (openCamera) ?
        
      
    <View style={styles.container}>
      <Portal>
      <CameraView style={styles.cameraMode} ref={cameraRef } onMountError={()=>alert("ei")}>

      {(Boolean(info))
          ? <View><Text style={{ color: "#fff" }}>{info}</Text></View>
          : <View><Text></Text></View>}

        <FAB
          style={styles.buttoTakePhoto}
          icon="camera"
          label=""
          onPress={takePhoto} />

        <FAB
          style={styles.buttonClose}
          icon="close"
          label=""
          onPress={() => setOpenCamera(false)} />

      </CameraView></Portal>
       </View> :
      
      
        <><Button style={{ marginTop: 20 }}
        mode="contained"
        icon="camera"
        onPress={() => startTheCamera()}>Take a new photo
      </Button>
      {showListGraphics ? <><Text>Photos from device</Text><View>
          {photosFromDb.map((photo: Photos, index: number) => (
            <><View style={styles.container} key={index+10}>
              <Image
                key={index+100}
                style={styles.image}
                source={{ uri: photo.Device_path }} />
            </View>
            <List.Item
                 style={styles.list}
                  title={` photo name: ${photo.name}`}
                  key={index+1000}
                  description={`Photo text : ${photo.imageText} And location: ${photo.location_lat}, ${photo.location_lon} and time: ${new Date(photo.time_photo).toLocaleString()} `}
                  descriptionNumberOfLines={4}
                   />
            <Button style={{ marginTop: 20 }}
              mode="contained"
              icon="minus"
              key={index+50}
              onPress={() => saveDeleteImageIndex(Number(photo.id))}>Delete image
              </Button></>
          ))}

        </View></>
      
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
        </Portal>
        <Portal>
          <Dialog
            visible={showDialogdelete}
            onDismiss={() => setShowDialogPhoto(false)}
          >
            <Dialog.Title>Do you want to delete the image</Dialog.Title>
           
            <Dialog.Actions>
              <Button onPress={() => deletePhoto(deleteHandler.current) }>delete</Button>
              <Button onPress={() => setShowDialogdelete(false) }>Go back</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal></>
        

        )
}

const styles = StyleSheet.create({
  
  list: {
    backgroundColor: 'gray',
    margin : 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
     alignItems: 'center',
  },
  cameraMode: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonClose: {
    position: 'absolute',
    margin: 20,
    bottom: 0,
    right: 0

  },
 
  buttoTakePhoto: {
    position: 'absolute',
    margin: 20,
    bottom: 0,
    left: 0
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
  },

});


export default Photo;
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import {  Button, Dialog, Portal, TextInput } from 'react-native-paper';
import { useContext,  useEffect,  useMemo, useRef, useState } from 'react';
import { GpsTracker, JustAppContext } from '../context/JustAppContext';
import React from 'react';
import * as Location from 'expo-location';
import { ListItem } from 'react-native-elements';


let laskurioboolean = false//i explain this later
let saveOrNot = false
let tempSpeed = 0
let tempDistance = 0
let locationHaversinreturn = 0

const Tracker : React.FC = () : React.ReactElement => {
    const { 
        getPhoneLocation,
        location,
        saveExcersiceToDb,
        gpsdetailsFromDb,
        deleteExcercise
            
        
                        } = useContext(JustAppContext);
    const userInput = useRef("")
    const [startTracking, setStartTracking] = useState<boolean>(false)// gep starcker values
    const [startExcercise, setStartExcercise] = useState<boolean>(false)
    const [saveExcercise, setSaveExcercise] = useState<boolean>(false)
    const [calculate, setCalculate] = useState<boolean>(false)
    const [ongoingExcercise, setOngoingExcercise] = useState<boolean>(false)
    //const [saveOrNot, setSaveOrNot] = useState<boolean>(false)
    const getPhoneLocationtoCalculaate = async() =>{
      let locationTemp : Location.LocationObject 
      let { status } = await Location.requestForegroundPermissionsAsync();
      
       locationTemp  = await Location.getCurrentPositionAsync({});
        //console.log("this location",locationTemp)
       
        return locationTemp
      
    }
    useEffect(() => {
      getPhoneLocation()
      if ( location === undefined){
        getPhoneLocation()
      }

  }, []);
    function delay(ms: number) {
      return new Promise( resolve => setTimeout(resolve, ms) );
    }

    const updateCalculateBoolean = useMemo(() => { // jos voittaja löytyy pamautetaan boolean kilpailun päättämiseksi 
      return (calculateboolean : boolean) => {
        setCalculate(calculateboolean);
      };
    }, [setCalculate]);

    let radians = function (degree: number) {
      let rad: number = degree * Math.PI / 180;
      return rad;
    }
    const haversine = (luurilat: number, luurilon: number, lat2: number, lon2: number) => {
      let dlat, dlon, a, c, R: number;
      R = 6372.8; // km
      dlat = radians(lat2 - luurilat);
      dlon = radians(lon2 - luurilon);
      luurilat = radians(luurilat);
      lat2 = radians(lat2);
      a = Math.sin(dlat / 2) * Math.sin(dlat / 2) + Math.sin(dlon / 2) * Math.sin(dlon / 2) * Math.cos(luurilat) * Math.cos(lat2)
      c = 2 * Math.asin(Math.sqrt(a));
      return R * c;
    }
    
  
    const startExcerciseSaving = async (excersiceName: string, test : boolean) : Promise<void> =>{
        let permissionOk = await getPhoneLocationtoCalculaate()
        if (permissionOk){
            setStartTracking(false)
            //await getPhoneLocation()
            //setOngoingExcercise(test)
            let startTime = new Date().getTime()
            let stopTime = new Date().getTime()
            let recordingTime = new Date().getTime()
            let locationStart = await getPhoneLocationtoCalculaate()
            let locationEnd : Location.LocationObject
            let locationPoint : Location.LocationObject
            let loacionMeasureTemp : Location.LocationObject = await getPhoneLocationtoCalculaate()
            let speed = 0 
            let lowestSpeed = 1
            let lowSpeed = Number.POSITIVE_INFINITY;
            let highestSpeed = Number.NEGATIVE_INFINITY;
            let totalSpeed = 0
            let numberOfMeasurements = 0
            let DistanceTemp = 0
            let compareDistanceTemp = 0
            let compareTimeTemp = new Date().getTime()
            let locationResult = 0
            let locationTemp = 0
            console.log("we are running ", excersiceName, location)
            for (let i = 0; 1 < 100;){
              recordingTime = new Date().getTime()
              locationPoint = await getPhoneLocationtoCalculaate()
              if (locationPoint?.coords.speed !== undefined){
                speed = Number(locationPoint.coords.speed)
                console.log("onko undefined")
                highestSpeed = Math.max(highestSpeed, speed);
                if (speed >= lowestSpeed) {
                  lowSpeed = Math.min(lowSpeed, speed);
                    totalSpeed += speed;
                }
              }
              console.log("location", locationPoint)
              locationTemp =  haversine(Number(locationPoint?.coords.latitude), 
                                        Number(locationPoint?.coords.longitude), 
                                        Number(loacionMeasureTemp?.coords.latitude), 
                                        Number(loacionMeasureTemp?.coords.longitude));
              locationResult = locationResult + locationTemp//distance
              locationHaversinreturn = locationTemp // distance
              loacionMeasureTemp = locationPoint // location
              tempDistance = locationResult
              tempSpeed = totalSpeed

              if (locationResult > DistanceTemp ){ // lets find out if the user is in the same place too long time
                DistanceTemp = locationResult
                compareTimeTemp = new Date().getTime() // if not, lets update the time stamp
              }
              if (locationTemp === DistanceTemp){ // if distance is not growing lets calculate time and break the loop
                if (recordingTime-compareTimeTemp >= 600000){
                  console.log("interrupt")
                  setOngoingExcercise(false)
                  laskurioboolean = false
                  setSaveExcercise(false)
                  saveOrNot = false
                  break
                }

              }

              console.log("ollaanko loopis", speed, calculate, ongoingExcercise, locationResult, totalSpeed, location.coords.speed)
              numberOfMeasurements = numberOfMeasurements + 1
              if (laskurioboolean === false){
                console.log("if lause luupis")
                break
              }
              await delay(5000);
              //speed = speed + 1
            }
            stopTime = new Date().getTime()
            locationEnd = await getPhoneLocationtoCalculaate() // save the ending location
            const averageSpeed = totalSpeed / numberOfMeasurements;
            stopAndSaveExercise(excersiceName, startTime, stopTime,locationStart, locationEnd, averageSpeed, locationResult)
        }else{
          console.log("no permission")
        }
      }
      
      const stopAndSaveExercise = (excersiceName : string, startTime : number, stopTime: number,locationStart : Location.LocationObject, locationEnd :  Location.LocationObject, speed: number, locationResult : number) : void =>{
        if (saveOrNot){
          console.log("save")
          saveExcersiceToDb(excersiceName, startTime,stopTime,locationStart, locationEnd, speed, locationResult )
          // tallenna kantaan
        }
        
      }
    const saveUserInput = (feed : string) : void =>{
        userInput.current = feed

    }
    const StopExcercise = () :void =>{
        setOngoingExcercise(false)
        setSaveExcercise(false)
        //setSaveOrNot(false)
        saveOrNot = false
        laskurioboolean = false

    }
    const StopAndSaveExcerciseUser = () :void =>{
        // setSaveOrNot(true)
        saveOrNot = true
        setOngoingExcercise(false)
        setSaveExcercise(false)
        updateCalculateBoolean(false)
        laskurioboolean = false
    }
    const StartTrackingExcercise =  () :void =>{
        setOngoingExcercise(true)
        updateCalculateBoolean(true)
        laskurioboolean = true
        setTimeout( async () => {await startExcerciseSaving(String(userInput.current), true)}, 3000)
        
    }
    const stopCalculating = ():void =>{
      
      setSaveExcercise(true)
      
    }
   //console.log(gpsdetailsFromDb)
     return ( 
    <><><Text style={styles.headline}>Gps tracker</Text>
    <Button style={{ marginTop: 20 }}
         mode="contained"
         icon="plus"
         onPress={() => setStartTracking(true)}

       >Start excersice
       </Button><Portal>
           <Dialog
             visible={startTracking}
             onDismiss={() => setStartTracking(false)}
           >
             <Dialog.Title>Give name for your activite</Dialog.Title>
             <Dialog.Content>
               <TextInput
                 label="search"
                 mode="outlined"
                 placeholder='Write here the name'
                 onChangeText={(tex_text: string) => saveUserInput(tex_text)} />
             </Dialog.Content>
             <Dialog.Actions>
               <Button onPress={() => StartTrackingExcercise()}>Start Tracking</Button>
               <Button onPress={() => setStartTracking(false)}>go back</Button>
             </Dialog.Actions>
           </Dialog>
         </Portal><Portal>
           <Dialog
             visible={saveExcercise}
             onDismiss={() => setSaveExcercise(false)}
           >
             <Dialog.Title>Do you want to save this activitate?</Dialog.Title>
             <Dialog.Actions>
               <Button onPress={() => StopAndSaveExcerciseUser()}>Save</Button>
               <Button onPress={() => StopExcercise()}>dismiss</Button>
             </Dialog.Actions>
           </Dialog>
         </Portal>

         {ongoingExcercise ?
           <><Text>Ongoing excercise {tempDistance} speed : {tempSpeed} : location : {locationHaversinreturn}</Text><Button onPress={() => stopCalculating()}
             style={{ marginTop: 20 }}
             mode="contained"
             icon="plus">Stop excersice</Button></>
           :
           <Text style={styles.title}>Saved excercises</Text>}</><>
           {Boolean(gpsdetailsFromDb) ?

             
               gpsdetailsFromDb.map((excercise: GpsTracker, idx: number) => {
                 return (
                   <View key={idx} style={styles.listView}>
                     <ListItem key={excercise.sessionName} bottomDivider>

                       <ListItem.Content style={styles.listView}>
                         <ListItem.Title>excercise name: {excercise.sessionName} 
                                          Distance : {excercise.travelDistance.toFixed(2)} meters
                          </ListItem.Title>

                         <ListItem.Subtitle>avarage speed : {excercise.avarageSpeed.toFixed(2)}
                          </ListItem.Subtitle>

                         <ListItem.Subtitle>locatin start latitude: {excercise.location_start_lat}
                                             and longitude: {excercise.location_start_lon}
                            </ListItem.Subtitle>

                         <ListItem.Subtitle>locatin start latitude: {excercise.location_end_lat} 
                                            and longitude: {excercise.location_end_lon}
                            </ListItem.Subtitle>

                         <ListItem.Subtitle>Time start {new Date(excercise.time_gps_start).toLocaleString()}
                                             and end time: {new Date(excercise.time_gps_end).toLocaleString()} 
                                             excercise last: {Math.floor(new Date(excercise.time_gps_end).getTime() 
                                                              - new Date(excercise.time_gps_start).getTime()) / 60000}
                              </ListItem.Subtitle>
                       </ListItem.Content>
                       
                     </ListItem>
                     <Button style={{ marginTop: 20 }}
                                mode="contained"
                                icon="minus"
                                onPress={() => deleteExcercise(excercise.id)}

                              >Delete excersice
                              </Button>
                   </View>
                 );
               })
              : <Text style={styles.title}>No saved excersices</Text>}</></>
                   
              

)
}



const styles = StyleSheet.create({
  
  
    container: {
      flex: 1,
      justifyContent: 'center',
       alignItems: 'center',
    },
   
    listView: {
      backgroundColor : "lightgray",
      margin : 5
    },
   
    title: {
      fontWeight: 'bold',
      marginVertical: 4,
      margin:15,
      fontSize : 20
    },
    headline : {
      fontWeight: 'bold',
      marginVertical: 4,
      margin:15,
      fontSize : 25
    }
  });
  


export default Tracker
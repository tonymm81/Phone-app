import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import {  Button, Dialog, Portal, TextInput } from 'react-native-paper';
import { useContext,  useEffect,  useMemo, useRef, useState } from 'react';
import { JustAppContext } from '../context/JustAppContext';
import React from 'react';



let laskurioboolean = false//i explain this later

const Tracker : React.FC = () : React.ReactElement => {
    const { 
        getPhoneLocation,
        location
            
        
                        } = useContext(JustAppContext);
    const userInput = useRef("")
    const [startTracking, setStartTracking] = useState<boolean>(false)// gep starcker values
    const [startExcercise, setStartExcercise] = useState<boolean>(false)
    const [saveExcercise, setSaveExcercise] = useState<boolean>(false)
    const [calculate, setCalculate] = useState<boolean>(false)
    const [ongoingExcercise, setOngoingExcercise] = useState<boolean>(false)
    const [saveOrNot, setSaveOrNot] = useState<boolean>(false)
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
        let permissionOk = await getPhoneLocation()
        if (permissionOk){
            setStartTracking(false)
            getPhoneLocation()
            //setOngoingExcercise(test)
            let startTime = new Date().getTime()
            let stopTime = new Date().getTime()
            let recordingTime = new Date().getTime()
            let locationStart = location
            let locationEnd = {}
            let speed = 0
            let lowestSpeed = 3
            let lowSpeed = Number.POSITIVE_INFINITY;
            let highestSpeed = Number.NEGATIVE_INFINITY;
            let totalSpeed = 0
            let numberOfMeasurements = 0
           
            let locationResult = 0
            let locationTemp = 0
            console.log("we are running ", excersiceName, location)
            for (let i = 0; 1 < 100;){
              if (location?.coords.speed !== undefined){
                speed = location.coords.speed
                console.log("onko undefined")
                highestSpeed = Math.max(highestSpeed, speed);
                if (speed >= lowestSpeed) {
                  lowSpeed = Math.min(lowSpeed, speed);
                    totalSpeed += speed;
                }
              }
             
              locationTemp =  haversine(Number(location?.coords.latitude), 
                                        Number(location?.coords.longitude), 
                                        Number(locationStart?.coords.latitude), 
                                        Number(locationStart?.coords.longitude));
              locationResult = locationResult + locationTemp

              console.log("ollaanko loopis", speed, calculate, ongoingExcercise, locationResult, totalSpeed, location.coords.speed)
              numberOfMeasurements = numberOfMeasurements + 1
              if (laskurioboolean === false){
                console.log("if lause luupis")
                break
              }
              await delay(5000);
              speed = speed + 1
            }
            locationEnd = location // save the ending location
            const averageSpeed = totalSpeed / numberOfMeasurements;
            stopAndSaveExercise(excersiceName, startTime, stopTime,locationStart, locationEnd, averageSpeed, locationResult)
        }else{
          console.log("no permission")
        }
      }
      
      const stopAndSaveExercise = (excersiceName : string, startTime : number, stopTime: number,locationStart : {}, locationEnd :  {}, speed: number, locationResult : number) : void =>{
        if (saveOrNot){
          console.log("save")
          // tallenna kantaan
        }
        
      }
    const saveUserInput = (feed : string) : void =>{
        userInput.current = feed

    }
    const StopExcercise = () :void =>{
        setOngoingExcercise(false)
        setSaveExcercise(false)
        setSaveOrNot(false)

    }
    const StopAndSaveExcerciseUser = () :void =>{
        setSaveOrNot(true)
        setOngoingExcercise(false)
        setSaveExcercise(false)
    }
    const StartTrackingExcercise =  () :void =>{
        setOngoingExcercise(true)
        updateCalculateBoolean(true)
        laskurioboolean = true
        //setTimeout(() => {setOngoingExcercise(true), console.log("1")}, 800)
        //setTimeout(() => {setOngoingExcercise(true), console.log("2")}, 1800)
        setTimeout( async () => {await startExcerciseSaving(String(userInput.current), true)}, 3000)
        
    }
    const stopCalculating = ():void =>{
      updateCalculateBoolean(false)
      setSaveExcercise(true)
      laskurioboolean = false
    }

    //console.log("boolean", ongoingExcercise, location.coords.speed)
     return ( 
    <><><Text style={styles.headline}>Gps tracker</Text>
    <Button style={{ marginTop: 20 }}
            mode="contained"
            icon="plus"
            onPress={() => setStartTracking(true) }

        >Start excersice
        </Button></>
            <Portal>
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
                        <Button  onPress={() => StartTrackingExcercise() }>Start Tracking</Button>
                        <Button onPress={() => setStartTracking(false) }>go back</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Portal>
                <Dialog
                    visible={saveExcercise}
                    onDismiss={() => setSaveExcercise(false)}
                >
                    <Dialog.Title>Do you want to save this activitate?</Dialog.Title>
                    <Dialog.Actions>
                        <Button onPress={() => StopAndSaveExcerciseUser()} >Save</Button>
                        <Button onPress={() => StopExcercise() }>dismiss</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            {ongoingExcercise ? 
                    <><Text>Ongoing excercise</Text>
                    <Button onPress={() => stopCalculating() }
                    style={{ marginTop: 20 }}
                    mode="contained"
                    icon="plus">Stop excersice</Button></>
            : 
                    <Text>ei ja tähän listaa suorituksista</Text>
                    
                    
            }
            
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
  


export default Tracker
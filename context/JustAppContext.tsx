import React, { createContext, useEffect, useMemo, useRef, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { ENV_VAR } from "@env" 
import * as Location from 'expo-location';
import { Camera, CameraCapturedPicture, CameraView, PermissionResponse } from 'expo-camera';


export const JustAppContext: React.Context<any> = createContext(undefined); 

const db: SQLite.SQLiteDatabase = SQLite.openDatabaseSync("JustApp.db");

const weahter_api = ENV_VAR

db.execAsync( // tää on sqgl kysely sijainneista
 
    //tx.executeSql(`DROP TABLE forecastOld`); // tankataan voittajan tiedot tänne
    `CREATE TABLE IF NOT EXISTS forecastOld (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    City TEXT,
                    timestamp datetime,
                    max_temp FLOAT,
                    min_temp FLOAT,
                    description TEXT,
                    icon TEXT
                  );`);
  
db.execAsync( // tää on sqgl kysely sijainneista
    //tx.executeSql(`DROP TABLE Photos`); // tankataan dartsimatsin tulokset tänne
    
    `
    CREATE TABLE IF NOT EXISTS Photos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    imageText TEXT,
                    location_lon FLOAT,
                    location_lat float,
                    Device_path TEXT,
                    time_photo datetime
                  )`);
 

db.execAsync( // tää on sqgl kysely sijainneista
  
    //tx.executeSql(`DROP TABLE GpsTracker`); // tankataan tikkakilpailun detailit tänne
    `CREATE TABLE IF NOT EXISTS GpsTracker (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    sessionName TEXT,
                    time_gps_start datetime,
                    time_gps_end datetime,
                    avarageSpeed Float,
                    location_start_lat  FLOAT,
                    location_start_lon FLOAAT,
                    location_end_lat FLOAT,
                    location_end_lon FLOAT,
                    travelDistance FLOAt

                  );`);
  


export interface forecastOld { 
  id?: number,
  City: string,
  timestamp: number,
  max_temp: number,
  min_temp: number,
  description: string,
  icon: string
}

export interface Photos { 
  id?: string,
  name: string,
  imageText: string,
  location_lon: number,
  location_lat: number,
  Device_path: string,
  time_photo: Date
}

export interface GpsTracker { 
  id?: string,
  sessionName: string,
  time_gps_start: Date,
  time_gps_end: Date,
  avarageSpeed: number,
  location_start_lat  : number,
  location_start_lon :number,
  location_end_lat :number,
  location_end_lon :number,
  travelDistance : number
  
}


interface Props {
  children: React.ReactNode;
}

const get_forecast = async (lat: any): Promise<any> => { // get forecast
  const forecastresponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat[0]}&lon=${lat[1]}&appid=${weahter_api}&units=metric`); //https://xamkbit.azurewebsites.net/saaennuste/${userchoose}
  const responseData = forecastresponse.json();
  return responseData
}

const get_location = async (city_name: string, country_code: string): Promise<any> => { // get location codes
  const locationresponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city_name},${country_code}&limit=${5}&appid=${weahter_api}`);
  const responseDataLocation = await locationresponse.json();
  console.log("json", responseDataLocation[0]["lat"])
  if (responseDataLocation) {

      let latitude = responseDataLocation[0]["lat"]
      let lonngitude = responseDataLocation[0]["lon"]
      console.log("details", latitude, lonngitude)
      return [latitude, lonngitude]
  }

}


export const JustAppProvider: React.FC<Props> = (props: Props): React.ReactElement => { // tämä toimittaan sen tiedon propseilla
  const [cityForecast, setCityForecast] = useState<string>("Tampere") //forecast values
  const [forecalsDB, setForecastDB] = useState<forecastOld[]>([]);
  const [allowForecast, setAllowForecast] = useState<boolean>(false)
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState<string>("");

  const cameraRef: any = useRef<CameraView>();// cameras values
  const [info, setInfo] = useState<string>()
  const [openCamera, setOpenCamera] = useState<boolean>(false)
  const [photosFromDb, setPhotosFromDb] = useState<Photos[]>([]) 
  const [allowTakePhoto, setAllowTakePhoto] = useState<boolean>(false) 
  const [showDialogPhoto, setShowDialogPhoto] = useState<boolean>(false)
  const [showDialogdelete, setShowDialogdelete] = useState<boolean>(false)
  const [savedPicture, setSavedPicture] = useState<CameraCapturedPicture>()
  

  const [gpsdetailsFromDb, setGpsdetailsFromDb] = useState<GpsTracker[]>([])
  useEffect(() => {
    getPhotosDb()
        if (photosFromDb.length === 0){
         getPhotosDb()   
        }
    getPhoneLocation()
    if (location === undefined){
      getPhoneLocation()

    }
    searchForecastDB()
    if (forecalsDB === undefined){
      searchForecastDB()
    }
    getExcersicesFromDb()
    if (gpsdetailsFromDb === undefined){
      getExcersicesFromDb()
    }

}, []);

  
// forecast functions
  const get_location_user = async (userFeed : string) =>{ // here we get location Coordinates
    setCityForecast(userFeed)
    let location_lat = await get_location(userFeed, "fi")
    return location_lat 
  }
  const getForecatasUser = async (userFeed : string) =>{ // Here we get forrecast what based on given coordinates
    if (allowForecast === true){
      let location_code = await get_location_user(userFeed)
      let getForecast = await get_forecast(location_code)
      //console.log("from context", getForecast)
      save_forecast_db(getForecast)
      setAllowForecast(false)
      setShowDialog(false)
      return 
    }else {
      setShowDialog(false)
      return {}
    }
   
  }

  const getForecast_based_gps = async () =>{
   let value = await getPhoneLocation()
   if(value){
    let newForecast = await get_forecast([location?.coords.latitude, location?.coords.longitude])
    //console.log("did we get loaction based fc", newForecast)
    save_forecast_db(newForecast)
   }else{

   }

  }

  const getPhoneLocation = async() =>{
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return false;
    }else{
      let locationTemp = await Location.getCurrentPositionAsync({});
      //console.log("this location",locationTemp)
      setLocation(locationTemp);
      setTimeout(()=> {setLocation(locationTemp)}, 500)

      return true
    }
  }
  const deleteForecast = async () : Promise<void> => {
    await db.runAsync('DELETE FROM forecastOld',[]); // Binding named parameters from object

  }
  const save_forecast_db = async (wholeForecast : any): Promise<void> =>{
    if (Object.keys(wholeForecast).length > 0){
      deleteForecast()
      for (let i = 0; i < Object.keys(wholeForecast).length; i++){
      
          if (wholeForecast.city.name === undefined ){
            wholeForecast.city.name = ""
          }
          
          await db.execAsync(`INSERT INTO forecastOld (City, timestamp, max_temp, min_temp, description, icon) VALUES (${wholeForecast.city.name},${wholeForecast['list'][i]['dt']},${ wholeForecast['list'][i]['main']['temp_max']},${wholeForecast['list'][i]['main']['temp_min'] },${wholeForecast['list'][i]['weather'][0]['main']},${ wholeForecast['list'][i]['weather'][0]['icon']});`, 
            )
          searchForecastDB(); // tällä synkataan tietokanta lisäyksen jälkeen
    }
  }
}
const searchForecastDB = async (): Promise<void> =>{
  const allRows: forecastOld[] = await db.getAllAsync('SELECT * FROM forecastOld');
            setTimeout(()=> {setForecastDB(allRows)}, 500)
            setForecastDB(allRows);
          
      
}

const startTheCamera = async (): Promise<void> => {// käynnistä kamera ja kysy lupa, jos lupa on avataan kuvaustila
  
  if (!allowTakePhoto) {
    const cameraPermission: PermissionResponse = await Camera.requestCameraPermissionsAsync();
    console.log(cameraPermission.granted, cameraPermission)
    setOpenCamera(cameraPermission.granted)
    setInfo((!cameraPermission.granted) ? "No permission to use a camera." : "")
    setAllowTakePhoto(true)
  }
  if (allowTakePhoto) {
    setOpenCamera(true)
  }
}

const takePhoto = async (): Promise<void> => { // räpsitään kuva

  setInfo("...Just wait a moment")
  const pohtoTemp: CameraCapturedPicture = await cameraRef.current.takePictureAsync()  
  setOpenCamera(false)// kuvaustila pois ja haetaan kannan kuvat
  setInfo("")
  //console.log("ca mera", pohtoTemp)
  setSavedPicture(pohtoTemp)
  setShowDialogPhoto(true)
  //haeKuvat();
}

const savePhotoToDb = async (imagetext : string, headliner : string) : Promise<void> =>{
  getPhoneLocation()
  if (location?.coords.latitude  && location.coords.longitude && location.timestamp && savedPicture){
    console.log("db statement", headliner, imagetext, location.coords.longitude, location.coords.latitude, savedPicture.uri, location.timestamp)
    const statement = await db.prepareAsync(
      'INSERT INTO Photos (name, imageText, location_lon, location_lat, Device_path, time_photo) VALUES ($name, $imageText, $location_lon, $location_lat, $Device_path, $time_photo)'
    );
    try {
      let result = await statement.executeAsync({ $name: `${headliner}`, $imageText: `${location.coords.longitude}`, $location_lat:` ${location.coords.latitude}`,$Device_path:`${savedPicture.uri }`,$time_photo : ` ${ location.timestamp}`});
      console.log('bbb and 101:', result.lastInsertRowId, result.changes, result);
    
     
    } finally {
      await statement.finalizeAsync();
    }
    
   /* try {
      const statement = await db.prepareAsync( // tankataan kantaan otettu kuva
        `INSERT INTO Photos (name, imageText, location_lon, location_lat, Device_path, 
        time_photo) VALUES (${headliner}, 
        ${imagetext}, 
        ${location.coords.longitude}, 
        ${location.coords.latitude}, 
        ${savedPicture.uri }, 
        ${ location.timestamp})`)
      console.log("statement db photos", statement)    
      setShowDialogPhoto(false)
      getPhotosDb()

    }
    catch(error){
      console.log("error photos ", error)
    }*/
    }else{
      console.log("If clause failed on photos")
    }
  
}
const getPhotosDb = async () :Promise<void> =>{
  const photosRow: Photos[] = await db.getAllAsync('SELECT * FROM Photos');
  setPhotosFromDb(photosRow); 
  setTimeout(() => {setPhotosFromDb(photosRow)}, 800)
  setPhotosFromDb(photosRow);
  console.log("is there any images", photosFromDb)
}

const saveExcersiceToDb = (excersiceName : string, startTime : number, stopTime: number,locationStart : Location.LocationObject, locationEnd :  Location.LocationObject, speed: number, locationResult : number) : void =>{
  getPhoneLocation()
  if (locationStart?.coords.latitude  && locationStart.coords.longitude){
    
  db.execAsync( // tankataan kantaan otettu kuva
        `INSERT INTO GpsTracker (sessionName, time_gps_start, time_gps_end, avarageSpeed, location_start_lat, location_start_lon, location_end_lat,location_end_lon, travelDistance ) VALUES (${excersiceName}, ${startTime}, ${stopTime}, ${speed}, ${locationStart.coords.latitude}, ${locationStart.coords.longitude}, ${locationEnd.coords.latitude}, ${ locationEnd.coords.longitude}, ${locationResult});`)   
      console.log("tallennettiinko suoritus")
      getExcersicesFromDb()
    }
}

const getExcersicesFromDb = async (): Promise<void> =>{
  const excersicesRow: GpsTracker[] = await db.getAllAsync('SELECT * FROM GpsTracker');
  setGpsdetailsFromDb(excersicesRow); 
  setGpsdetailsFromDb(excersicesRow);
        
}

const deleteExcercise = async (index : number) :Promise<void> =>{
  await db.runAsync('DELETE FROM GpsTracker WHERE value = $value', {index}); 
  getExcersicesFromDb()
}

const deletePhoto = async (index : number) :Promise<void> =>{
  await db.runAsync('DELETE FROM Photos WHERE value = $value', {index}); // Binding named parameters from object 
  setShowDialogdelete(false)
  getPhotosDb()
}


 
  return (
    <JustAppContext.Provider value={{
                                    get_location_user, // forecast values and functionss
                                    getForecatasUser,
                                    forecalsDB,
                                    searchForecastDB,
                                    getForecast_based_gps,
                                    getPhoneLocation,
                                    setAllowForecast,
                                    showDialog,
                                    setShowDialog,
                                    startTheCamera,// camera values and functionss
                                    takePhoto,
                                    allowTakePhoto,
                                    cameraRef,
                                    info,
                                    setOpenCamera,
                                    openCamera,
                                    savePhotoToDb,
                                    showDialogPhoto,
                                    setShowDialogPhoto,
                                    getPhotosDb,
                                    photosFromDb,
                                    deletePhoto,
                                    showDialogdelete,
                                    setShowDialogdelete,
                                    location,
                                    gpsdetailsFromDb,// gps values
                                    saveExcersiceToDb,
                                    deleteExcercise
                                    
                                    }}>
            {props.children}
    </JustAppContext.Provider>
  );
}
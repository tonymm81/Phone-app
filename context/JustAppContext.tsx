import React, { createContext, useEffect, useMemo, useRef, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { ENV_VAR } from "@env" 



export const JustAppContext: React.Context<any> = createContext(undefined); // huomaa exportti, muuten ei toimi

const db: SQLite.SQLiteDatabase = SQLite.openDatabase("JustApp.db");

const weahter_api = ENV_VAR

db.transaction( // tää on sqgl kysely sijainneista
  (tx: SQLite.SQLTransaction) => {
    //tx.executeSql(`DROP TABLE Voittajat`); // tankataan voittajan tiedot tänne
    tx.executeSql(`CREATE TABLE IF NOT EXISTS forecastOld (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    City TEXT,
                    timestamp datetime,
                    max_temp FLOAT,
                    min_temp FLOAT,
                    description TEXT,
                    icon TEXT
                  )`);
  },
  (err: SQLite.SQLError) => {
    console.log(err)
  }
);
db.transaction( // tää on sqgl kysely sijainneista
  (tx: SQLite.SQLTransaction) => {
    //tx.executeSql(`DROP TABLE DartsTikka`); // tankataan dartsimatsin tulokset tänne
    tx.executeSql(`CREATE TABLE IF NOT EXISTS Photos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    imageText TEXT,
                    location_lon FLOAT,
                    location_lat float,
                    Device_path TEXT,
                    time_photo datetime
                  )`);
  },
  (err: SQLite.SQLError) => {
    console.log(err)
  }
);

db.transaction( // tää on sqgl kysely sijainneista
  (tx: SQLite.SQLTransaction) => {
    //tx.executeSql(`DROP TABLE MokkiTikka`); // tankataan tikkakilpailun detailit tänne
    tx.executeSql(`CREATE TABLE IF NOT EXISTS GpsTracker (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    sessionName TEXT,
                    time_gps_start datetime,
                    time_gps_end datetime,
                    avarageSpeed Float,
                    UserNotes TEXT

                  )`);
  },
  (err: SQLite.SQLError) => {
    console.log(err)
  }
);


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
  UserNotes: string,
  
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
  const [cityForecast, setCityForecast] = useState<string>("Tampere")
  const [forecalsDB, setForecastDB] = useState<forecastOld[]>([]);

  const get_location_user = async (userFeed : string) =>{
    setCityForecast(userFeed)
    let location_lat = await get_location(userFeed, "fi")
    //console.log("from context", location_lat)
    return location_lat 
  }
  const getForecatasUser = async (userFeed : string) =>{
    let location_code = await get_location_user(userFeed)
    let getForecast = await get_forecast(location_code)
    //console.log("from context", getForecast)
    save_forecast_db(getForecast)
    return getForecast
  }

  const getForecast_based_gps = () =>{
    return
  }

  const getPhoneLocation = () =>{
    return
  }
  const deleteForecast = () : void => {

    db.transaction(
      (tx : SQLite.SQLTransaction) => {
        tx.executeSql(`DELETE FROM forecastOld`, [], 
          (_tx : SQLite.SQLTransaction, rs : SQLite.SQLResultSet) => {
            //haeOstokset();
          });
      }, 
      (err: SQLite.SQLError) => console.log(err));

  }
  const save_forecast_db = (wholeForecast : any): void =>{
    if (Object.keys(wholeForecast).length > 0){
      deleteForecast()
      for (let i = 0; i < Object.keys(wholeForecast).length; i++){
      db.transaction(
        (tx : SQLite.SQLTransaction) => {
          
          tx.executeSql(`INSERT INTO forecastOld (City, timestamp, max_temp, min_temp, description, icon) VALUES (?,?,?,?,?,?)`, 
            [cityForecast ,wholeForecast['list'][i]['dt'], wholeForecast['list'][i]['main']['temp_max'], wholeForecast['list'][i]['main']['temp_min'] , wholeForecast['list'][i]['weather'][0]['main'] , wholeForecast['list'][i]['weather'][0]['icon'] ],
            (_tx : SQLite.SQLTransaction, rs : SQLite.SQLResultSet) => {
              console.log("did we save")
              searchForecastDB(); // tällä synkataan tietokanta lisäyksen jälkeen

            });
        }, 
        (err: SQLite.SQLError) => console.log(err));

    }
  }
}
const searchForecastDB = (): void =>{
  db.transaction( // huomaa tyypitykset
      (tx : SQLite.SQLTransaction) => {
        tx.executeSql(`SELECT * FROM forecastOld`, [], 
          (_tx : SQLite.SQLTransaction, rs : SQLite.SQLResultSet) => {// tää on etr mitä me tehdään niille tuloksille jokka kannasta tulee.
            setForecastDB(rs.rows._array); // pusketaan interfaceen.
          });
      }, 
      (err: SQLite.SQLError) => console.log(err));
}
 
  return (
    <JustAppContext.Provider value={{
                                    get_location_user,
                                    getForecatasUser,
                                    forecalsDB,
                                    searchForecastDB
                                    }}>
            {props.children}
    </JustAppContext.Provider>
  );
}
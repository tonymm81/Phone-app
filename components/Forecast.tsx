import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { Button, Dialog, Portal, TextInput } from 'react-native-paper';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { forecastOld, JustAppContext } from '../context/JustAppContext';
import { ListItem, Avatar } from 'react-native-elements'


const Forecast: React.FC = (): React.ReactElement => {
    const { get_location_user, 
            getForecatasUser, 
            forecalsDB, 
            searchForecastDB, 
            getForecast_based_gps,
            getPhoneLocation,
            setAllowForecast,
            showDialog,
            setShowDialog } = useContext(JustAppContext);

    const [showGraphics, setShowGraphics] = useState<boolean>(false)
   
    const textinputhandler = useRef("")


    useEffect(() => { // lisaa pelaaja funktiota kutsuttiin ja kampataan viive
        setAllowForecast(true)
        searchForecastDB()
        if (forecalsDB.length === 0){
            getForecatasUser("tampere")
        }else {
            searchForecastDB()// prepare if forecast db is empty
        }
        setShowGraphics(true)

    }, []);
   
    function getIconUrl(code: string): string {
        //console.log(code)
        return `http://openweathermap.org/img/wn/${code}.png`; //weahter api icon
    }
    const handleInput = (values : string) : void  => {
        textinputhandler.current = values
        setAllowForecast(true)
    }
    const searchForecastByLocation = () : void =>{
        let tempLocation = getForecast_based_gps()
    }
    //console.log(forecalsDB)


    return (<>
        <Text style={styles.text} >Forecast</Text>
        <Button  style={{ marginTop : 20 }}
                mode="contained"
                icon="cloud-search"
                onPress={()=> setShowDialog(true)}
                > search</Button>
        <Button  style={{ marginTop : 20 }}
                mode="contained"
                icon="tag-search"
                onPress={()=> searchForecastByLocation()}> search by location</Button>
        <Portal>
          <Dialog
            visible={showDialog}
            onDismiss={() => setShowDialog(false)}
          >
            <Dialog.Title>Search for town or city name</Dialog.Title>
            <Dialog.Content>
              <TextInput 
                label="search"
                mode="outlined"
                placeholder='Write location what you want'
                onChangeText={ (nex_text : string) => handleInput(nex_text)}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={()=>getForecatasUser(textinputhandler.current)}>search</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        {forecalsDB.map((forecast: forecastOld, idx: number) => {
            return (
                <View key={idx}>
                    <ListItem key={forecast.timestamp} bottomDivider>
                        <Avatar source={{ uri: getIconUrl(forecast.icon) }} />
                        <ListItem.Content>
                            <ListItem.Title>{new Date(forecast.timestamp*1000).toLocaleString()}</ListItem.Title>
                            <ListItem.Subtitle>{forecast.description}</ListItem.Subtitle>
                            <ListItem.Subtitle>Min: {forecast.min_temp}°C, Max: {forecast.max_temp}°C</ListItem.Subtitle>
                            <ListItem.Subtitle>Location: {forecast.City}</ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                </View>
            )
        })}

    </>)
}
const styles = StyleSheet.create({
    text: {
        padding: 5,
        alignItems: 'center',
        margin: 5,
        fontSize: 25
    },
    dialogitekstikentat: {
        margin: 10,
        padding: 10
    },
    tallennasijainti: {
        marginTop: 15,
        margin: 10,
        bottom: 0,
        right: 0
    },
    kuva: {
        width: 320,
        height: 420,
        resizeMode: 'stretch'
    }
});


export default Forecast;
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { forecastOld, JustAppContext } from '../context/JustAppContext';
import { ListItem, Avatar } from 'react-native-elements'


const Forecast: React.FC = (): React.ReactElement => {
    const { get_location_user, getForecatasUser, forecalsDB, searchForecastDB } = useContext(JustAppContext);
    const [showGraphics, setShowGraphics] = useState<boolean>(false)


    useEffect(() => { // lisaa pelaaja funktiota kutsuttiin ja kampataan viive
        //getForecatasUser("tampere")
        searchForecastDB()// prepare if forecast db is empty
        setShowGraphics(true)

    }, []);
    function getIconUrl(code: string): string {
        console.log(code)
        return `http://openweathermap.org/img/wn/${code}.png`; //weahter api icon
    }
    //let test = get_location_user()<Avatar source={{ uri: item.icon }} />
    console.log(forecalsDB)


    return (<>
        <Text style={styles.text} >Forecast</Text>
        {forecalsDB.map((forecast: forecastOld, idx: number) => {
            return (
                <View key={idx}>
                    <ListItem key={forecast.timestamp} bottomDivider>
                        <Avatar source={{ uri: getIconUrl(forecast.icon) }} />
                        <ListItem.Content>
                            <ListItem.Title>{new Date(forecast.timestamp).toLocaleString()}</ListItem.Title>
                            <ListItem.Subtitle>{forecast.description}</ListItem.Subtitle>
                            <ListItem.Subtitle>Min: {forecast.min_temp}°C, Max: {forecast.max_temp}°C</ListItem.Subtitle>
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
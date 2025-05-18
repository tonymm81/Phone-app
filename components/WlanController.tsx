import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";


const RPI_HOST = "https://192.168.68.201:5000"; // Raspberry Pi:n osoite

const WlanController = () => {
  const [data, setData] = useState<string>("");

  // 🔎 **GET-pyyntö - haetaan data palvelimelta**
  const fetchData = async () => {
    try {
      const response = await fetch(`${RPI_HOST}/data`, {
        method: "GET",
        headers: { "Content-Type": "application/json" } 
      });

      if (!response.ok) throw new Error("GET-pyyntö epäonnistui.");

      const result = await response.json();
      setData(result.message);
      Alert.alert("GET onnistui", result.message);
    } catch (error) {
      console.error("GET virhe:", error);
      Alert.alert("GET epäonnistui", "Tarkista palvelimen saatavuus!");
    }
  };

  // 📤 **POST-pyyntö - lähetetään JSON palvelimelle**
  const sendData = async () => {
    try {
      const jsonData = { JSONdata: "Hello Raspberry Pi!" };

      const response = await fetch(`${RPI_HOST}/receive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) throw new Error("POST-pyyntö epäonnistui.");

      const result = await response.json();
      Alert.alert("POST onnistui", JSON.stringify(result));
    } catch (error) {
      console.error("POST virhe:", error);
      Alert.alert("POST epäonnistui", "Tarkista palvelimen saatavuus!");
    }
  };
  useEffect(() => {
    fetchData(); // Ladataan data sovelluksen käynnistyessä
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>Data palvelimelta:</Text>
      <Text>{data || "Ei dataa vielä"}</Text>
      <Button title="Hae Data (GET)" onPress={fetchData} />
      <Button title="Lähetä Data (POST)" onPress={sendData} />
    </View>
  );
};

export default WlanController;
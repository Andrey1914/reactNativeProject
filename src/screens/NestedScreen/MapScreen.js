// import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function MapScreen({ route }) {
  const { latitude, longitude } = route.params.location;

  return (
    <View style={styles.container}>
      <MapView
        style={{ flex: 1, marginHorizontal: 16 }}
        initialRegion={{
          longitude,
          latitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.006,
        }}
      >
        <Marker
          coordinate={{
            longitude,
            latitude,
          }}
          title={route.params.title}
          description={route.params.description}
        ></Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#121212",
  },
  text: {
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
    color: "#FFF",
  },
});

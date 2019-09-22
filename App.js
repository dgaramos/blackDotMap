/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import Geolocation from '@react-native-community/geolocation';
import DeviceInfo from 'react-native-device-info';

const MAPBOX_ACCESS_TOKEN = 'aa';
MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

console.disableYellowBox = true;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  annotationContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  annotationFill: {
    width: 17,
    height: 17,
    borderRadius: 15,
    backgroundColor: '#000',
    transform: [{scale: 0.8}],
  },
});

export default class App extends Component {
  state = {
    location: null,
    locations: [
      {
        coords: [-46.6503112, -23.555538],
        description: 'O dev está aqui',
      },
      {
        coords: [-37.0475415, -10.9133521],
        description: 'Ponte do Imperador',
      },
    ],
  };

  async componentDidMount() {
    if (!(await this.isSimulator())) {
      this.findCoordinates();
    }
  }

  async isSimulator() {
    return DeviceInfo.isEmulator();
  }

  findCoordinates = () => {
    Geolocation.getCurrentPosition(
      position => {
        const location = JSON.stringify(position);

        const coordinates = JSON.parse(location);

        this.setState({location: coordinates.coords});
      },
      error => Alert.alert(error.message),
      {enableHighAccuracy: true, timeout: 200000000000},
    );
  };

  render() {
    return (
      <MapboxGL.MapView
        centerCoordinate={
          this.state.location
            ? [
                parseFloat(this.state.location.longitude),
                parseFloat(this.state.location.latitude),
              ]
            : [-37.0475415, -10.9133521]
        }
        style={styles.container}
        showUserLocation
        styleURL={MapboxGL.StyleURL.Standard}>
        {this.state.locations.map((loc, i) => {
          return (
            <MapboxGL.PointAnnotation
              key={i}
              id="myLocation"
              coordinate={loc.coords}>
              <View style={styles.annotationContainer}>
                <View style={styles.annotationFill} />
              </View>
              <MapboxGL.Callout title={loc.description} />
            </MapboxGL.PointAnnotation>
          );
        })}
      </MapboxGL.MapView>
    );
  }
}

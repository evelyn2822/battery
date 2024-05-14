import React from 'react';
import { View } from 'react-native';
import BatteryInfo from './BatteryInfo'; // Importing the BatteryInfo component

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <BatteryInfo /> {/* Rendering the BatteryInfo component */}
    </View>
  );
}

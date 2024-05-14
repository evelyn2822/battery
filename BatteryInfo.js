import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Platform } from 'react-native';
import * as Battery from 'expo-battery';

export default function BatteryInfo() {
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [batteryState, setBatteryState] = useState(Battery.BatteryState.UNKNOWN);
  const [lowPowerMode, setLowPowerMode] = useState(false);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    const batteryLevelListener = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      setBatteryLevel(Math.round(batteryLevel * 100));
    });

    const batteryStateListener = Battery.addBatteryStateListener(({ batteryState }) => {
      setBatteryState(batteryState);
      setIsCharging(batteryState === Battery.BatteryState.CHARGING);
    });

    const lowPowerModeListener = Battery.addLowPowerModeListener(({ lowPowerMode }) => {
      setLowPowerMode(lowPowerMode);
    });

    // Fetch initial battery level, state, low power mode, and charging status
    (async () => {
      const initialBatteryLevel = await Battery.getBatteryLevelAsync();
      setBatteryLevel(Math.round(initialBatteryLevel * 100));

      const initialBatteryState = await Battery.getBatteryStateAsync();
      setBatteryState(initialBatteryState);
      setIsCharging(initialBatteryState === Battery.BatteryState.CHARGING);
      
      const initialLowPowerMode = await Battery.isLowPowerModeEnabledAsync();
      setLowPowerMode(initialLowPowerMode);
    })();

    // Clean up listeners
    return () => {
      batteryLevelListener.remove();
      batteryStateListener.remove();
      lowPowerModeListener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.phone}>
        <View style={styles.screen}>
          <Text style={styles.title}>Battery Information</Text>
          <Text style={styles.text}>Current Battery Level: {batteryLevel}%</Text>
          <Text style={styles.text}>Battery State: {batteryState}</Text>
          <Text style={styles.text}>Low Power Mode: {lowPowerMode ? 'Enabled' : 'Disabled'}</Text>
          <Text style={styles.text}>Charging: {isCharging ? 'Yes' : 'No'}</Text>
        </View>
      </View>
    </View>
  );
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phone: {
    width: Platform.OS === 'web' ? '90%' : screenWidth * 0.9,
    aspectRatio: 9 / 16,
    borderRadius: 30,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? screenHeight * 0.1 : 0, // Adjust marginTop for Android devices
  },
  screen: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: screenWidth * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

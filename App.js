import './src/utils/polyfill';
import React, { useRef } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainStackNavigator from './src/navigation';

const App = () => {
  const navRef = useRef(null);

  return (
    <SafeAreaProvider>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <MainStackNavigator navigationRef={navRef} />
    </SafeAreaProvider>
  );
};

export default App;

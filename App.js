import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'react-native';
import MainStackNavigator from './src/navigation';
import SplashScreen from './src/screen/SplashScreen';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const navRef = useRef(null);

  useEffect(() => {
    // Set SplashScreen selama 2 detik
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    // Clear timeout saat komponen unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* <StatusBar hidden={false} backgroundColor="transparent"
        barStyle="dark-content" /> */}
      {showSplash ? (
        <SplashScreen />
      ) : (
        <MainStackNavigator navigationRef={navRef} />
      )}
    </>
  );
};

export default App;

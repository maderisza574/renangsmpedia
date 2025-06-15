import { registerRootComponent } from 'expo';
import { AppRegistry } from 'react-native';
import App from './src'; // Adjust the import path based on your project structure

AppRegistry.registerComponent(appName, () => App);
console.disableYellowBox = true;

registerRootComponent(App);

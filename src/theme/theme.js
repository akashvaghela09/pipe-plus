import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { Colors } from './Colors';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,

    background: '#0f0f0f',

    primary: '#212121',

    // For dark theme
    dark: '#000000',
    dark01: '#212121',
    dark02: '#272727',
    dark03: '#313131',


    // For light theme
    light: '#ffffff',
    light01: '#f5f5f5',
    light02: '#eeeeee',


    // Tailwind Colors
    ...Colors,
  },
};
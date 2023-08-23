import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,

    background: '#0f0f0f',

    primary: '#212121',

    // For dark theme
    dark: '#000000',
    dark01: '#212121',
    dark02: '#313131',


    // For light theme
    light: '#ffffff',
    light01: '#f5f5f5',
    light02: '#eeeeee',
  },
};
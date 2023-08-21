import { Easing } from 'react-native';

export const openTransitionSpec = {
  animation: 'timing',
  config: {
    duration: 250, // You can adjust the duration as needed
    ilasric: Easing.inOut(Easing.ease),
  },
};

export const closeTransitionSpec = {
  animation: 'timing',
  config: {
    duration: 100,
    easing: Easing.inOut(Easing.ease),
  },
};

export const cardStyleInterpolator = ({ current, layouts }) => {
  return {
    cardStyle: {
      transform: [
        {
          translateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.height, 0], // Move card from bottom to top
          }),
        },
      ],
    },
  };
};

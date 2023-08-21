import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen, SearchScreen } from '../../screens';
import { cardStyleInterpolator, closeTransitionSpec, openTransitionSpec } from '../../animation/animations';

const HomeStack = createStackNavigator();

export const HomeStackNavigator = ({ navigation }) => {

    return (
        <HomeStack.Navigator
            initialRouteName="HomeScreen"
            screenOptions={{
                headerShown: false,
                gestureDirection: 'vertical',
                transitionSpec: {
                    open: openTransitionSpec,
                    close: closeTransitionSpec,
                },
                cardStyleInterpolator: cardStyleInterpolator,
            }}
        >
            <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
            <HomeStack.Screen name="search" component={SearchScreen} />
        </HomeStack.Navigator>
    );
}

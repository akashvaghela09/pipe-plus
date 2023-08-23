import { createStackNavigator } from '@react-navigation/stack';
import { LibraryScreen, SearchScreen } from '../../screens';
import { cardStyleInterpolator, closeTransitionSpec, openTransitionSpec } from '../../animation/animations';

const LibraryStack = createStackNavigator();

export const LibraryStackNavigator = ({ navigation }) => {

    return (
        <LibraryStack.Navigator
            initialRouteName="LibraryScreen"
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
            <LibraryStack.Screen name="LibraryScreen" component={LibraryScreen} />
            <LibraryStack.Screen name="search" component={SearchScreen} />
        </LibraryStack.Navigator>
    );
}

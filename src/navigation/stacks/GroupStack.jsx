import { createStackNavigator } from '@react-navigation/stack';
import { GroupScreen, SearchScreen } from '../../screens';
import { cardStyleInterpolator, closeTransitionSpec, openTransitionSpec } from '../../animation/animations';

const GroupStack = createStackNavigator();

export const GroupStackNavigator = ({ navigation }) => {

    return (
        <GroupStack.Navigator
            initialRouteName="GroupScreen"
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
            <GroupStack.Screen name="GroupScreen" component={GroupScreen} />
            <GroupStack.Screen name="search" component={SearchScreen} />
        </GroupStack.Navigator>
    );
}

import { createStackNavigator } from '@react-navigation/stack';
import { SubscriptionScreen, SearchScreen } from '../../screens';
import { cardStyleInterpolator, closeTransitionSpec, openTransitionSpec } from '../../animation/animations';

const SubscriptionStack = createStackNavigator();

export const SubscriptionStackNavigator = ({ navigation }) => {

    return (
        <SubscriptionStack.Navigator
            initialRouteName="SubscriptionScreen"
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
            <SubscriptionStack.Screen name="SubscriptionScreen" component={SubscriptionScreen} />
            <SubscriptionStack.Screen name="search" component={SearchScreen} />
        </SubscriptionStack.Navigator>
    );
}

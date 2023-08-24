import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { enableScreens } from 'react-native-screens';
import { GroupStackNavigator, LibraryStackNavigator, SubscriptionStackNavigator, TabBar } from '../';
import { HomeStackNavigator } from '../';

// Optimize screen performance
enableScreens();

const Tab = createBottomTabNavigator();

export const screenOptions = (route, color) => {
    if (route.name === 'Group') {
        return <EntypoIcons name={"folder-video"} color={color} size={20} style={{ color: "white" }} />
    } else if (route.name === 'Subscription') {
        return <MaterialCommunityIcons name={"youtube-subscription"} color={color} size={20} style={{ color: "white" }} />;
    } else if (route.name === 'Home') {
        return <MaterialCommunityIcons name={"home-variant"} color={color} size={20} style={{ color: "white" }} />;
    } else if (route.name === 'Library') {
        return <MaterialIcons name={"video-library"} color={color} size={20} style={{ color: "white" }} />;
    }
};

export const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                tabBar={props => <TabBar {...props} />}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeStackNavigator}
                    options={{
                        tabBarLabel: 'Home',
                        title: 'Home',
                        headerShown: false,
                    }} />
                <Tab.Screen
                    name="Subscription"
                    component={SubscriptionStackNavigator}
                    options={{
                        tabBarLabel: 'Subscription',
                        title: 'Subscription',
                        headerShown: false
                    }} />
                <Tab.Screen
                    name="Group"
                    component={GroupStackNavigator}
                    options={{
                        tabBarLabel: 'Group',
                        title: 'Group',
                        headerShown: false,
                    }} />
                <Tab.Screen
                    name="Library"
                    component={LibraryStackNavigator}
                    options={{
                        tabBarLabel: 'Library',
                        title: 'Library',
                        headerShown: false,
                    }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

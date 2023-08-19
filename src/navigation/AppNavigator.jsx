import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { enableScreens } from 'react-native-screens';
import { HomeScreen, SubscriptionScreen, GroupScreen, LibraryScreen } from '../screens';

// Optimize screen performance
enableScreens();

const Tab = createBottomTabNavigator();

function AppNavigator() {

    const screenOptions = (route, color) => {
        if (route.name === 'Group') {
            return <EntypoIcons name={"folder-video"} color={color} size={24} style={{ color: "white" }} />
        } else if (route.name === 'Subscription') {
            return <MaterialCommunityIcons name={"youtube-subscription"} color={color} size={24} style={{ color: "white" }} />;
        } else if (route.name === 'Home') {
            return <MaterialCommunityIcons name={"home-variant"} color={color} size={24} style={{ color: "white" }} />;
        } else if (route.name === 'Library') {
            return <MaterialIcons name={"video-library"} color={color} size={24} style={{ color: "white" }} />;
        }
    };

    return (
        <NavigationContainer>
            <Tab.Navigator screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => screenOptions(route, color),
                tabBarStyle: {
                    backgroundColor: '#0f0f0f',
                },
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'white',
            })}>
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        title: 'Home',
                        headerShown: false,
                    }}
                />
                <Tab.Screen
                    name="Subscription"
                    component={SubscriptionScreen}
                    options={{
                        tabBarLabel: 'Subscription',
                        title: 'Subscription',
                        headerShown: false
                    }} />
                <Tab.Screen
                    name="Group"
                    component={GroupScreen}
                    options={{
                        tabBarLabel: 'Group',
                        title: 'Group',
                        headerShown: false
                    }} />
                <Tab.Screen
                    name="Library"
                    component={LibraryScreen}
                    options={{
                        tabBarLabel: 'Library',
                        title: 'Library',
                        headerShown: false,
                        style: {
                            color: "white"
                        }
                    }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;
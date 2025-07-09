import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './screens/Home';
import Settings from './screens/Settings';
import { IconButton, Provider as PaperProvider } from 'react-native-paper';

const Tab = createBottomTabNavigator();

const AppMain = () => {
  return (
    <PaperProvider>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#4A90E2',
          tabBarInactiveTintColor: 'gray',
          headerTitleAlign: 'center'
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: true,
            headerTitle: 'My Day',
            headerTitleStyle: {
              fontSize: 30,
              fontWeight: '700',
              color: '#4A90E2',
            },
            tabBarIcon: ({ color }) => (
              <IconButton
                icon="home-outline"
                size={35}
                iconColor={color}
                style={{ margin: 'auto' }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Accounts"
          component={Settings}
          options={{
            tabBarIcon: ({ color }) => (
              <IconButton
                icon="account-outline"
                size={35}
                iconColor={color}
                style={{ margin: 'auto' }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </PaperProvider>
  );
};

export default AppMain;

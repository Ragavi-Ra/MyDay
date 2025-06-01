import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import Signup from './screens/Signup';
import Login from './screens/Login';
import AppMain from './AppMain';
import JournalPage from './screens/JournalPage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native';
import Home from './screens/Home';

const Stack = createStackNavigator();

function App(): React.JSX.Element {

  return (
    <GestureHandlerRootView style={{flex:1}}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* <Stack.Screen name="Signup" component={Signup} /> */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={AppMain} options={{ headerShown: false }} />
        <Stack.Screen name="JournalPage" component={JournalPage} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>
    // <SafeAreaView style={{ flex: 1 }}>
    //   <Stack.Screen name="Login" component={Login} />
    //   <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

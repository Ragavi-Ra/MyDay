import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/Login';
import AppMain from './AppMain';
import JournalPage from './screens/JournalPage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { scheduleDailyReminder } from './utils/scheduleReminder';
import AuthLoading from './screens/AuthLoading';
import './utils/firebaseConfig';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  useEffect(() => {
      scheduleDailyReminder();
  }, []);
  return (
    <GestureHandlerRootView style={{flex:1}}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthLoading">
        <Stack.Screen name="AuthLoading" component={AuthLoading} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={AppMain} options={{ headerShown: false }} />
        <Stack.Screen name="JournalPage" component={JournalPage} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
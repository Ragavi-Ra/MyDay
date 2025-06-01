import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { auth } from '../utils/firebaseConfig';

const Settings = ({navigation}:any) => {
    const logout = async () => {
    try {
      await auth().signOut();
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      navigation.replace('Login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };
  return (
    <View>
        <Text>Settings</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                  <Text style={styles.buttonText}>🚪 Logout</Text>
                </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    logoutButton: {
    backgroundColor: '#E74C3C',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
})
export default Settings
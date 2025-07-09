import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ActivityIndicator, } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth } from '../utils/firebaseConfig';

const Settings = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const currentUser = auth().currentUser;

  const userDetails: any = {
    uid: currentUser?.uid,
    name: currentUser?.displayName,
    email: currentUser?.email,
  };

  const logout = async () => {
    try {
      setLoading(true);
      await auth().signOut();
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      navigation.replace('Login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>My Account</Text>

        <View style={styles.card}>
          <Text style={styles.label}>👤 Name</Text>
          <Text style={styles.value}>{userDetails.name || 'N/A'}</Text>

          <Text style={styles.label}>📧 Email</Text>
          <Text style={styles.value}>{userDetails.email || 'N/A'}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Logout</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    width: '100%',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
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
});

export default Settings;

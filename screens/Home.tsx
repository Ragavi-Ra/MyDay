import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const Home = ({ navigation }: any) => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://zenquotes.io/api/today')
      .then(res => res.json())
      .then(data => {
        setQuote(`${data[0].q} — ${data[0].a}`);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch quote:', err);
        setQuote('Keep going. Your story is not over yet.');
        setLoading(false);
      });
  }, []);

  // const logout = async () => {
  //   try {
  //     await auth().signOut();
  //     await GoogleSignin.revokeAccess();
  //     await GoogleSignin.signOut();
  //     navigation.replace('Login');
  //   } catch (error) {
  //     console.error('Error signing out: ', error);
  //   }
  // };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Journal</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>

        <View style={styles.card}>
          {loading ? (
            <ActivityIndicator size="large" color="#4A90E2" />
          ) : (
            <Text style={styles.quoteText}>{quote}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('JournalPage')}
        >
          <Text style={styles.buttonText}>✍️ Create a Journal</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.buttonText}>🚪 Logout</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C3E50',
  },
  date: {
    fontSize: 18,
    color: '#7F8C8D',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 24,
    marginVertical: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    width: '100%',
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#34495E',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 12,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  // logoutButton: {
  //   backgroundColor: '#E74C3C',
  //   padding: 16,
  //   borderRadius: 12,
  //   marginTop: 10,
  //   width: '100%',
  //   alignItems: 'center',
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.2,
  //   shadowRadius: 4,
  //   elevation: 3,
  // },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Home;

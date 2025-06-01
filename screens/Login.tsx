import React, { useEffect, useState, useRef  } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { auth } from '../utils/firebaseConfig';
import firestore from '@react-native-firebase/firestore';

const Login = ({navigation}: any) => {
  const [loading, setLoading] = useState(false);
  const hasNavigated = useRef(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user && !hasNavigated.current) {
        hasNavigated.current = true;
        navigation.navigate('Home');
      }
    });

    return () => unsubscribe();
  }, []);

  const saveUserIfNew = async () => {
  const currentUser = auth().currentUser;
  console.log(currentUser)
  if (!currentUser) return;

  const userRef = firestore().collection('users').doc(currentUser.uid);
  const doc = await userRef.get();
  console.log(userRef)
  console.log(doc)
  console.log("data", doc.data())
  console.log("meta data", doc.metadata)
  console.log("exist", doc.exists())
  console.log("id", doc.id)
  console.log("ref", doc.ref)
  console.log("get", doc.get)
  // console.log("get", currentUser.)

  if (!doc.exists()) {
    userRef.set({
      uid: currentUser.uid,
      name: currentUser.displayName,
      email: currentUser.email,
      // createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ User saved to Firestore');
  } else {
    console.log('🔁 User already exists in Firestore');
  }
};

  const onGoogleButtonPress = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const isSignedIn = await GoogleSignin.hasPreviousSignIn(); // ✅ Correct way to check
    let idTokenval: string | null = null;

    if (isSignedIn) {
      console.log('🔁 Already signed in');
    } else {
      console.log('🆕 Performing Google Sign-In...');
      await GoogleSignin.signIn(); // ✅ Don't extract idToken here
    }

    // ✅ Always fetch token using getTokens
    const { idToken } = await GoogleSignin.getTokens();
    if (!idToken) throw new Error('❌ Failed to retrieve idToken');

    idTokenval = idToken;

    const googleCredential = auth.GoogleAuthProvider.credential(idTokenval);
    await auth().signInWithCredential(googleCredential);

    console.log('✅ Signed in with Firebase');
    await saveUserIfNew();
    navigation.navigate('Home');

  }
  catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Sign-in cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign-in in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play services not available or outdated');
      } else {
        Alert.alert('Some other error happened', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={onGoogleButtonPress}>
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 24 },
  button: { backgroundColor: '#4285F4', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 4 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

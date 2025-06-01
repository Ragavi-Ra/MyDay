import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

GoogleSignin.configure({
  webClientId: '188586900910-njpvh7l5b1f3e2et7cnkles3kj93h6gd.apps.googleusercontent.com',
  projectId: "myday-13"
});

export { auth, GoogleSignin };

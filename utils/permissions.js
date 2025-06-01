import { PermissionsAndroid, Platform } from 'react-native';

export const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const cameraPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );

      const mediaImagesPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      );

      const allGranted =
        cameraPermission === PermissionsAndroid.RESULTS.GRANTED &&
        mediaImagesPermission === PermissionsAndroid.RESULTS.GRANTED;

      return allGranted;
    } catch (err) {
      console.warn('Permission request failed:', err);
      return false;
    }
  }

  return true; // iOS
};

import AsyncStorage from '@react-native-async-storage/async-storage';

export const localStoreUserData = async localUserData => {
  try {
    const localUserDataJson = JSON.stringify(localUserData);
    await AsyncStorage.setItem('@localUserData', localUserDataJson);
  } catch (e) {
    console.warn('Local User Data Error:', e);
  }
};

export const getLocalStoredUserData = async () => {
  try {
    const localUserDataJson = await AsyncStorage.getItem('@localUserData');
    const localUserData =
      localUserDataJson != null ? JSON.parse(localUserDataJson) : null;

    return localUserData;
  } catch (e) {
    console.warn('Local User Data Error:', e);
  }
};

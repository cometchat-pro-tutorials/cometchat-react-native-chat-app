import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAzpy3dK0e_nEbAH1Njt7y2uWvtRxdQ5Ww',
  authDomain: 'cometchat-8a80c.firebaseapp.com',
  projectId: 'cometchat-8a80c',
  storageBucket: 'cometchat-8a80c.appspot.com',
  messagingSenderId: '144950255069',
  appId: '1:144950255069:web:a8ac078bb0cea217eb6a34',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

let firebaseConfig = {
    apiKey: 'AIzaSyC5DQo8-COGi_6JVlddbhEaQCRjpfWGag0',
    authDomain: 'requests-0908.firebaseapp.com',
    projectId: 'requests-0908',
    storageBucket: 'requests-0908.appspot.com',
    messagingSenderId: '391973237612',
    appId: '1:391973237612:web:33717bd215decf17bc7949',
    measurementId: 'G-RBK528FHJN',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;

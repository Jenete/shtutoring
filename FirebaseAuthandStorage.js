import { getAuth, onAuthStateChanged, signInWithEmailAndPassword , createUserWithEmailAndPassword} from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-auth.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import { getStorage, ref, uploadBytes,  uploadBytesResumable, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-storage.js";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyDq1wBanesnqpv9fGS8nbN_ot7qDoI2HCs",
    authDomain: "lastoption-4ac5c.firebaseapp.com",
    projectId: "lastoption-4ac5c",
    storageBucket: "lastoption-4ac5c.appspot.com",
    messagingSenderId: "115613337020",
    appId: "1:115613337020:web:1050f2172b798bd1ec17b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);



const storage = getStorage(app);
// uploadBytes(storageRef, file).then((snapshot) => {
//   console.log('Uploaded a blob or file!');
// })
export var progress = 0;
export var downloadLink = "";
export function uploadDocument(file){
      // Upload file and metadata to the object 'images/mountains.jpg'
const storageRef = ref(storage, 'files/' + file.name);
const uploadTask = uploadBytesResumable(storageRef, file);

// Listen for state changes, errors, and completion of the upload.
uploadTask.on('state_changed',
  (snapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;
      case 'storage/canceled':
        // User canceled the upload
        break;

      // ...

      case 'storage/unknown':
        // Unknown error occurred, inspect error.serverResponse
        break;
    }
  }, 
  () => {
    // Upload completed successfully, now we can get the download URL
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
      downloadLink = downloadURL;
    });
  }
);
}
export var files = [];
export async function getFiles(){
  const listRef = ref(storage, 'files');
  var file = {name: "", href: ""}
// Find all the prefixes and items.
  listAll(listRef)
  .then((res) => {
    // res.prefixes.forEach((folderRef) => {
    //   // All the prefixes under listRef.
    //   // You may call listAll() recursively on them.
    // });
    
    files = [];
    res.items.forEach((itemRef) => {
      // All the items under listRef.
      
      getDownloadURL(itemRef).then((downloadURL) => {
        //console.log('File available at', downloadURL);
      //console.log(itemRef);
      files.push({name: itemRef.name, href: downloadURL});
      //console.log(files.length)
      });
      
    });
  }).catch((error) => {
    // Uh-oh, an error occurred!
    console.log("Error while trying to list files");
  });
  files = files.sort((a,b)=> {
    if (a.name > b.name) return 1;
    else if (a.name == b.name) return 0;
    else return -1;
  });
  return files;
}




export async function registerUser(email, password){
    var status = false;
    await createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log(user);
    localStorage.setItem("user1",JSON.stringify(user));
    status = true;
    //return user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    //return null;
    // ..
  });
  return status;
}
export async function signinuser(email, password){
  var user = null;
    await signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    user = userCredential.user;
    localStorage.setItem("user1",JSON.stringify(user));
    return user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    return null;
  });
  return user;
}
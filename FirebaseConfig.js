import { getFirestore, collection, getDocs, addDoc, updateDoc, doc,query, deleteDoc, deleteField, setDoc, where } from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-auth.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBxMemxEkFOLLIrk0bsV6Aumk47L8CqLdo",
    authDomain: "theflutterway.firebaseapp.com",
    projectId: "theflutterway",
    storageBucket: "theflutterway.appspot.com",
    messagingSenderId: "301563028413",
    appId: "1:301563028413:web:0a0dc2845d692b57eae8d4"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
onAuthStateChanged(auth, user => { /* check status */ });

// Get a list of cities from your database
async function getAllFromTable(table) {
  var users = []
  const citiesCol = collection(db, table);
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => users.push(doc.data()));
  return users;
} 
async function AddToTable(data, table) {
  const citiesCol = doc(db, table, data.id);
  var status = false;
  await setDoc(citiesCol,data).then(()=>{
    status = true;
    return true;
  }).catch((err)=>{
    console.log("Error from config"+err);
    status = false;
    return false;
  })
  return status;
}
async function updateUserData(data, table) {
  // const citiesCol = collection(db, table);
  //  var status = false;
  // await setDoc(doc(citiesCol,data.id), data).then(()=>{
  //   status = true;
  //   //return true;
  // }).catch((err)=>{
  //   status = false;
  //   return false;
  // })

  const citiesRef = collection(db, table);
  //const status = false;
  // try{
  //   await setDoc( doc(citiesRef, data.id), data);
  //   return true
  // }catch(e){
  //   console.log(e);
  //   return false
  // }
  
  // return status;
//   const citiesRef = collection(db,table);

// // Create a query against the collection.
console.log("update -" + data.toString());
 const q = query(citiesRef, where("id", "==", data.id));
console.log("Status: "+q);
const querySnapshot = await getDocs(q);
querySnapshot.forEach(async (docu) => {
 // doc.data() is never undefined for query doc snapshots
    
   if(docu.id == data.id){
      await setDoc(doc(citiesRef, docu.id),data);
     // status = true;
      console.log("Evaulated to "+true);
      return true;
    }
//     //status = true;
});
  return false;
}
async function deleteData(data, table) {
  const citiesCol = collection(db, table,data.id);
  var status = false;
  await deleteDoc(citiesCol).then(()=>{
    status = true;
    return true;
  }).catch((err)=>{
    status = false;
    console.log("Error from config"+err);
    return false;
  })
  return status;
}

export class firebase{
    
    async  getClients(){
      try{
        return await getAllFromTable("Clients").then(results => results);
      }catch(e){
        console.log(e)
        return [];
      }
        
    }
    async getStudents(){
      try{
        return await getAllFromTable("Students").then(results => results);
      }catch(e){
        console.log(e)
        return [];
      }
    }
    async updateLearner(user){
      try{
      //if(this.checkConnection() == false) return false;
      
      return await AddToTable(user, "Students").then(result=> result);
    }catch(e){
      console.log(e);
      return false;
    }
    }
    async checkConnection(){
      try{
        const online = await fetch("./ClientViewer.html")
        return online.status > 200 && online.status < 300;
      }
      catch(e){
        return false;
      }
    }
    async getChats(){
        try{
        return await getAllFromTable("Chats").then(results => results);
      }catch(e){
        console.log(e)
        return [];
      }
    }
    async addClient(details){
      try{
        return await AddToTable(details,"Clients").then((result) => result);
      }catch(e){
        return false;
      }
    }
    async addChat(details){
      try{
        return await AddToTable(details,"Chats").then((result) => result);
      }catch(e){
        return false;
      }
    }
    async updateUserDetails(user){
          try{
          if(this.checkConnection() == false) return false;
          return await updateUserData(user, "Clients").then(result=> result);
        }catch(e){
          console.log(e);
          return false;
        }
    }
    async removeUser(user){
      deleteData(user, "Clients");
    }

    async updateData(clients){
          var status = false;
          if (clients.length == 0) return true;
          clients.forEach(async (element) => {
             status =  await this.updateUserDetails(element);
          });
          return status;
        
    }
}
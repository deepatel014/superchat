import './App.css';
import React from 'react';
// import firebase from 'firebase/app';
// import 'firebase/firestore';
// import 'firebase/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

import {useState,useRef} from 'react';

firebase.initializeApp({
  apiKey: "AIzaSyA7FC6I2teN8YDY_4KwVUpvpGhTPbfUi80",
  authDomain: "superchat-d04d8.firebaseapp.com",
  projectId: "superchat-d04d8",
  storageBucket: "superchat-d04d8.appspot.com",
  messagingSenderId: "260292377802",
  appId: "1:260292377802:web:362602f8cc1e95a1464833",
  measurementId: "G-X3S4TT6LYZ"

});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  

  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );

  
}
function SignIn(){
  const signInWithGoogle = () =>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  );
}

function SignOut(){
  return auth.currentUser && (
    <button onClick= {()=> auth.signOut()}>Sign Out</button>
  )
}
function ChatRoom(){

    const dummy = useRef();
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);

    const [messages] = useCollectionData(query,{idField:'id'});

    const [formValue,setFormValue] =  useState('');

    const sendMessage = async(e) =>{ 
      e.preventDefault();
      const {uid,photoURL} = auth.currentUser;
      await messagesRef.add({
        text:formValue,
        createdAt:firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL
      });
      setFormValue('');
      dummy.current.scrollIntoView({behaviour:'smooth'});
    }


    return(
      <>
      <main>
        <div>
          {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
          <div ref={dummy}></div>
        </div>
        </main>
        <form  onSubmit={sendMessage}>
          <input value={formValue} onChange={(e)=> setFormValue(e.target.value)}/>

          <button type = "submit">🕊</button>
        </form>
      </>
    )
}

function ChatMessage(props){
  const {text,uid,photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';


  return (
      <div className = {`message ${messageClass} `}>
        <img src={photoURL} alt='🐶'/>
        <p>{text}</p>

      </div>
   
)
}

export default App;

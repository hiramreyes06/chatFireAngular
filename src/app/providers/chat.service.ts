import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';


import { Mensaje } from '../interface/mensaje.interface';

import { map } from 'rxjs/operators';





@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Mensaje>;

  public chats:Mensaje[]=[];
  public usuario:any={};

  constructor(private afs: AngularFirestore,
    public afAuth: AngularFireAuth) { 

      this.afAuth.authState.subscribe( user=>{

        console.log('Estado del usuario: ', user);

        if(!user){
          return;
        }
        this.usuario.nombre= user.displayName;
        this.usuario.uid=user.uid;

      })

    }


    login(provideer:String) {

      if(provideer==='google'){
        this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());

      }
      else{
        this.afAuth.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider);
      }
      
    }
    logout() {
      this.usuario={};
      this.afAuth.auth.signOut();
    }


  cargarMensajes(){

    this.itemsCollection = this.afs.collection<Mensaje>('chats', 
    ref=> ref.orderBy('fecha', 'desc').limit(5) );

   return this.itemsCollection.valueChanges()
   .pipe(map( (mensajes:Mensaje[] )=>{
      console.log(mensajes);

    this.chats=[];  //esto

    for(let mensaje of mensajes){   //esto
      this.chats.unshift(mensaje);
    }

    return this.chats;//Esto es opcionap, para trabajar con la data

    //this.chats=mensajes;
   })/*el del map*/   )//el del pipe

  }


  agregarMensaje(texto:String){

   // TODO segun falta el UID del usuario
   let mensaje:Mensaje={
     nombre: this.usuario.nombre,
     mensaje: texto,
     fecha:new Date().getTime(),
     uid: this.usuario.uid
   }

   return this.itemsCollection.add(mensaje);

  }


}//la clase

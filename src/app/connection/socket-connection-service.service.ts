import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import {v4 as uuidv4} from 'uuid';
@Injectable({
  providedIn: 'root'
})
export class SocketConnectionServiceService {
  roomID:string="";
  constructor(private _socket:Socket,private router:Router) {

  }
  createRoomID():string{
    this.roomID=uuidv4();
    console.log("created Room ID:",this.roomID);
    return this.roomID;
  }
  initiateRoomConnection(roomID:string,displayName:string,picture:string, email:string){
    this._socket.emit("user:room-join",{roomID,displayName,picture,email});
    this.router.navigate([`/call/${roomID}`]);
  }
  joinRoom(roomID:string,displayName:string,picture:string,email:string){
    this._socket.emit("user:room-join",{roomID,displayName,picture,email});
    this.router.navigate([`/call/${roomID}`]);
  }

}

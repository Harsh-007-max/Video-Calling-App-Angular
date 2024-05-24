import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root',
})
export class SocketConnectionServiceService {
  roomID: string = '';
  peerConnection: RTCPeerConnection;
  constructor(
    private _socket: Socket,
    private router: Router,
  ) {
    this.peerConnection = this.initializePeerConnection();
    this.registerSocketEvents();
  }

  private initializePeerConnection(): RTCPeerConnection {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            'stun:stun.l.google.com:19302',
            'stun:global.stun.twilio.com:3478',
          ],
        },
      ],
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this._socket.emit('peer:ice-candidate', {
          candidate: event.candidate,
          roomID: this.roomID,
        });
      }
    };

    return peerConnection;
  }
  private registerSocketEvents() {
    this._socket.on('peer:offer', (data: any) =>
      this.handleIncommingCall(data),
    );
    this._socket.on('peer:ice-candidate', (data: any) =>
      this.handleNewICECandidate(data),
    );
  }
  handleNewICECandidate(data: any) {
    const candidate = new RTCIceCandidate(data.candidate);
    this.peerConnection.addIceCandidate(candidate);
  }

  createRoomID(): string {
    this.roomID = uuidv4();
    console.log('created Room ID:', this.roomID);
    return this.roomID;
  }
  initiateRoomConnection(
    roomID: string,
    displayName: string,
    picture: string,
    email: string,
  ) {
    this._socket.emit('user:room-join', {
      roomID,
      displayName,
      picture,
      email,
    });
    this.router.navigate([`/call/${roomID}`]);
  }
  joinRoom(
    roomID: string,
    displayName: string,
    picture: string,
    email: string,
  ) {
    this._socket.emit('user:room-join', {
      roomID,
      displayName,
      picture,
      email,
    });
    this.router.navigate([`/call/${roomID}`]);
  }
  async getOffer(roomID: string) {
    const offer = await this.peerConnection.createOffer();
    this.peerConnection.setLocalDescription(new RTCSessionDescription(offer));
    return offer;
  }

  async createAnswer(offer: any) {
    this.peerConnection.setRemoteDescription(offer);
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(
      new RTCSessionDescription(answer),
    );
    return answer;
  }
  async handleUserJoined(data: any) {
    const { username,roomID } = data;
    const offer = await this.getOffer(roomID);
    console.log(username,"joined the room")
    this._socket.emit('peer:init-call', { to: roomID, offer });
  }
  async handleIncommingCall(data: any) {
    const { from, user, offer } = data;
    const answer = await this.createAnswer(offer);
    this._socket.emit('peer:call-accepted', { to: user.roomID, offer: answer });
  }
}

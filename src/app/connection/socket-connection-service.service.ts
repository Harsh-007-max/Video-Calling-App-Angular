import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root',
})
export class SocketConnectionServiceService {
  roomID: string = '';
  toggleCam: boolean = false;
  toggleMic: boolean = false;
  remoteStream: MediaStream = new MediaStream();
  localStream: MediaStream = new MediaStream();
  peerConnection: RTCPeerConnection;
  constructor(
    private _socket: Socket,
    private router: Router,
  ) {
    this.peerConnection = this.initializePeerConnection();
    this.registerSocketEvents();
    this.peerConnection.addEventListener('track', async (ev) => {
      const remoteStream = ev.streams;
      this.remoteStream = remoteStream[0];
    });
  }
  async userMediaControl() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: this.toggleMic,
      video: this.toggleCam,
    });
    this.localStream = stream;
    this.sendStream(stream);
  }
  sendStream(stream: any) {
    for (const track of stream.getTracks()) {
      this.peerConnection.addTrack(track, stream);
    }
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

    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream.addTrack(track);
      });
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
    await this.peerConnection.setLocalDescription(offer);
    return offer;
  }

  async getAnswer(offer: any) {
    await this.peerConnection.setRemoteDescription(offer);
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    return answer;
  }

  async handleUserJoined(data: any) {
    const { username, roomID } = data;
    const offer = await this.getOffer(roomID);
    console.log(username, 'joined the room');
    this._socket.emit('peer:init-call', { to: roomID, offer });
  }
  async handleIncommingCall(data: any) {
    const { from, user, offer } = data;
    const answer = await this.getAnswer(offer);
    this._socket.emit('peer:call-accepted', { to: user.roomID, offer: answer });
  }

  async handleCallAccept(data: any) {
    const { from, offer } = data;
    console.log('handleCallAccepted to:', from, 'offer', offer);
    this.userMediaControl();
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    await this.handleNegotiation();
  }

  async handleNegotiation() {
    const offer = await this.getOffer(this.roomID);
    this._socket.emit('peer:negotiation', { to: this.roomID, offer });
  }

  async hanldeIncommingNegotiation(data: any) {
    const { from, offer } = data;
    const answer = await this.getAnswer(offer);
    this._socket.emit('peer:negotiation-result', { to: from, answer });
  }
  async handleFinalizeNegotiation(data: any) {
    const { to, answer } = data;
    await this.peerConnection.setRemoteDescription(answer);
  }
}

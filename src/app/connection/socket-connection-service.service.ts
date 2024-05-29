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
  showRemoteStream: boolean = false;
  localStream: MediaStream = new MediaStream();
  peerConnection: RTCPeerConnection;
  remoteSocketID: any;
  user: any;
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

    // peerConnection.ontrack = (event) => {
    //   event.streams[0].getTracks().forEach((track) => {
    //     console.log('addPeerConnectionTrackListener1');
    //     this.remoteStream.addTrack(track);
    //   });
    // };
    return peerConnection;
  }
  addPeerConnectionTrackListener() {
    this.peerConnection.addEventListener('track', async (ev) => {
      console.log('addPeerConnectionTrackListener2');
      const remoteStream = ev.streams;
      this.remoteStream = remoteStream[0];
    });
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
    this.showRemoteStream = true;
    // this.addPeerConnectionTrackListener();
    this.router.navigate([`/call/${roomID}`]);
  }
  async getOffer() {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(
      new RTCSessionDescription(offer),
    );
    return offer;
  }

  async getAnswer(offer: any) {
    await this.peerConnection.setRemoteDescription(offer);
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(
      new RTCSessionDescription(answer),
    );
    return answer;
  }

  async userMediaControl() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    this.localStream = stream;
  }

  sendStream() {
    for (const track of this.localStream.getTracks()) {
      this.peerConnection.addTrack(track, this.localStream);
    }
  }

  async handleUserJoined(data: any) {
    const { username, socketId, roomID } = data;
    await this.userMediaControl();
    this.roomID = roomID;
    const offer = await this.getOffer();
    this.remoteSocketID = socketId;
    console.log(username, 'joined the room');
    // this._socket.emit('peer:init-call', { to: this.remoteSocketID, offer });
    this._socket.emit('peer:init-call', { to: roomID, offer });
  }
  async handleIncommingCall(data: any) {
    const { from, offer } = data;
    // this.remoteSocketID = from;
    await this.userMediaControl();
    const answer = await this.getAnswer(offer);
    console.log('answer:', answer);
    // this._socket.emit('peer:call-accepted', { to: from, answer });
    this._socket.emit('peer:call-accepted', { to: from, answer });
  }

  async handleCallAccept(data: any) {
    const { from, answer } = data;
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log('handleCallAccepted to:', from, 'answer: ', answer);
    this.userMediaControl();
    this.sendStream();
    // const answer = await this.getAnswer(offer);
    // this._socket.emit('peer:call-accepted', { to: from, offer: answer });

    await this.handleNegotiation();
  }

  async handleNegotiation() {
    const offer = await this.getOffer();
    console.log('handleNegotiation');
    this._socket.emit('peer:negotiation', { to: this.roomID, offer });
    this._socket.emit('peer:negotiation', { to: this.remoteSocketID, offer });
  }

  async hanldeIncommingNegotiation(data: any) {
    const { from, offer } = data;
    const answer = await this.getAnswer(offer);
    console.log('hanldeIncommingNegotiation');
    this._socket.emit('peer:negotiation-result', { to: from, answer });
    // await this.peerConnection.setLocalDescription(new RTCSessionDescription(answer));
  }
  async handleFinalizeNegotiation(data: any) {
    const { to, answer } = data;
    console.log('handleFinalizeNegotiation');
    await this.peerConnection.setRemoteDescription(answer);
    // await this.peerConnection.setRemoteDescription(answer);
    // this.sendStream(this.localStream);
  }
  disconnect() {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = this.initializePeerConnection();
    }

    this.localStream.getTracks().forEach((track) => track.stop());
    this.remoteStream.getTracks().forEach((track) => track.stop());

    this._socket.emit('peer:disconnect', { roomID: this.roomID });

    this.localStream = new MediaStream();
    this.remoteStream = new MediaStream();
    this.router.navigate(['/home']);
  }
  handlePeerDisconnect() {
    this.disconnect();
    this.router.navigate(['/home']);
  }
}

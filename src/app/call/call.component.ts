import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrl: './call.component.css',
})
export class CallComponent {
  peerConnection: RTCPeerConnection;

  constructor(private socket: Socket) {}
  async ngOnInit() {
    this.socket.on('user:room-join', this.handleUserJoined);
    this.socket.on('peer:incomming-call', this.handleIncommingCall);
    this.socket.on('peer:call-accepted', () => {
      console.log('call accepted');
    });
  }

  async setupPeerConnection() {
    const peerConnection: RTCPeerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    this.peerConnection = peerConnection;
    console.log('constructor here:', this.peerConnection.createOffer());
  }

  async getOffer(roomID: string) {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    this.socket.emit('peer:init-call', { to: roomID, offer });
  }

  async createAnswer(offer: any) {
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    return answer;
  }

  async handleUserJoined(data: any) {
    const { roomID } = data;
    console.log('joined room', data);
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    this.socket.emit('peer:init-call', { to: roomID, offer });
    // await this.getOffer(roomID);
  }
  async handleIncommingCall(data: any) {
    const { from, user, offer } = data;
    const answer = await this.createAnswer(offer);
    console.log('incomming call');
    this.socket.emit('peer:call-accepted', { to: user.roomID, offer: answer });
  }
  handleUserDisconnected(data: any) {
    console.log(data);
  }
}

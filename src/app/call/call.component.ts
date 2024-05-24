import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { SocketConnectionServiceService } from '../connection/socket-connection-service.service';
@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrl: './call.component.css',
})
export class CallComponent implements OnInit {
  constructor(
    private socket: Socket,
    private socCon: SocketConnectionServiceService,
  ) { }
  ngOnInit() {
    this.socket.on(
      'user:room-join',
      this.socCon.handleUserJoined.bind(this.socCon),
    );
    this.socket.on(
      'peer:incomming-call',
      this.socCon.handleIncommingCall.bind(this.socCon),
    );
    this.socket.on('peer:call-accepted', () => {
      console.log('call accepted');
    });
  }

  async setupPeerConnection() { }

  handleUserDisconnected(data: any) {
    console.log(data);
  }
}

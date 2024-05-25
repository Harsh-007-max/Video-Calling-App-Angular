// import { Subject } from 'rxjs';
// import { WebcamImage } from 'ngx-webcam';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { SocketConnectionServiceService } from '../connection/socket-connection-service.service';
@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrl: './call.component.css',
})
export class CallComponent implements OnInit, AfterViewInit {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;
  constructor(
    private socket: Socket,
    private socCon: SocketConnectionServiceService,
  ) {}
  ngOnInit() {
    this.socket.on(
      'user:room-join',
      this.socCon.handleUserJoined.bind(this.socCon),
    );
    this.socket.on(
      'peer:incomming-call',
      this.socCon.handleIncommingCall.bind(this.socCon),
    );
    this.socket.on(
      'peer:call-accepted',
      this.socCon.handleCallAccept.bind(this.socCon),
    );
    this.socket.on(
      'peer:negotiate',
      this.socCon.hanldeIncommingNegotiation.bind(this.socCon),
    );
    this.socket.on(
      'peer:negotiation-result',
      this.socCon.handleFinalizeNegotiation.bind(this.socCon),
    );
  }
  ngAfterViewInit() {
    this.localVideo.nativeElement.srcObject = this.socCon.localStream;
    this.remoteVideo.nativeElement.srcObject = this.socCon.remoteStream;
  }
  async setupPeerConnection() {
    await this.socCon.userMediaControl();
  }
  handleUserDisconnected(data: any) {
    console.log(data);
  }
}

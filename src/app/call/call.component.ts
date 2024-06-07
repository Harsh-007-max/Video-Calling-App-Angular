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
  @ViewChild('localVideo') localVideo!: ElementRef;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef;
  constructor(
    private socket: Socket,
    public socCon: SocketConnectionServiceService,
  ) {}
  remoteThumbnail: string = '../../assets/video_off.svg';
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
    this.socket.on(
      'peer:disconnect',
      this.socCon.handlePeerDisconnect.bind(this.socCon),
    );
    this.socket.on(
      'stop:remoteVideo',
      this.socCon.handleToggleVideoStream.bind(this.socCon),
    );
  }
  async ngAfterViewInit() {
    // try {
    this.localVideo.nativeElement.srcObject = this.socCon.localStream;
    this.remoteVideo.nativeElement.srcObject = this.socCon.remoteStream;
    this.socCon.sendStream();
    console.log(this.socCon.localStream);
    console.log(this.socCon.remoteStream);
    // } catch (error) {}
  }
  handleCallDisconnect() {
    this.socCon.disconnect();
  }
  handleToggleMic() {
    this.socCon.toggleMic = !this.socCon.toggleMic;
    this.socCon.localStream.getAudioTracks().forEach((track) => {
      track.enabled = this.socCon.toggleMic;
    });
  }
  handleToggleCam() {
      this.socCon.toggleRemoteStream()
    }
  }


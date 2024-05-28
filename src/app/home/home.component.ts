import { Component, ViewChild, ElementRef } from '@angular/core';
import { FireAuthServiceService } from '../authentication/fire-auth-service.service';

import { User } from '@angular/fire/auth';

import { Subject } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';
import { SocketConnectionServiceService } from '../connection/socket-connection-service.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', '../login/login.component.css'],
})
export class HomeComponent {
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;
  constructor(
    private authService: FireAuthServiceService,
    public connectionService: SocketConnectionServiceService,
    private socket: Socket,
  ) {}
  user: User | null = null;
  userName: string = '';
  imgSrc: string | null = '../../assets/video_off.svg';
  audioStream: MediaStream = new MediaStream();
  videoStream: MediaStream = new MediaStream();
  createRoomID: string = '';
  receivedRoomID: string = '';
  vwidth = 190;
  vheight = 190;
  public triggerObservable: Subject<void> = new Subject<void>();
  async ngOnInit() {
    this.authService.user$.subscribe((user: any) => {
      this.user = user;
      this.userName = user.displayName ?? user.email.split('@')[0];
      this.userName = this.userName.split(' ')[0];
      this.imgSrc = user.photoURL ?? '../../assets/video_off.svg';
    });
    this.audioStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    this.videoStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    this.audioElement.nativeElement.srcObject = this.audioStream;
    this.audioElement.nativeElement.pause();
    this.createRoomID = this.connectionService.createRoomID();
    this.connectionService.localStream =
      await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
  }
  public handleImage(webcamImage: WebcamImage) {}

  async handleToggleCam() {
    this.connectionService.toggleCam = !this.connectionService.toggleCam;
  }
  async handleToggleMic() {
    if (this.connectionService.toggleMic) {
      if (this.audioElement.nativeElement.paused) {
        await this.audioElement.nativeElement.play();
      }
    } else {
      this.audioElement.nativeElement.pause();
    }
    this.connectionService.toggleMic = !this.connectionService.toggleMic;
  }
  async enterRoom() {
    this.connectionService.initiateRoomConnection(
      this.createRoomID,
      this.userName,
      this.imgSrc!,
      this.user!.email!,
    );
    await this.connectionService.userMediaControl();
  }
  async joinRoom() {
    console.log('recevied Room ID:', this.receivedRoomID);
    this.connectionService.joinRoom(
      this.receivedRoomID,
      this.userName,
      this.imgSrc!,
      this.user!.email!,
    );
    await this.connectionService.userMediaControl();
    this.connectionService.peerConnection.addEventListener(
      'track',
      async (ev) => {
        const remoteStream = ev.streams;
        this.connectionService.remoteStream = remoteStream[0];
      },
    );
  }
}

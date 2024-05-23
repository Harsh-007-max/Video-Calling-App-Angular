import { Component, ViewChild, ElementRef } from '@angular/core';
import { FireAuthServiceService } from '../authentication/fire-auth-service.service';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '@angular/fire/auth';

import { Subject } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', '../login/login.component.css'],
})
export class HomeComponent {
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;
  constructor(
    private authService: FireAuthServiceService,
    private afAuth: AngularFireAuth,
  ) { }
  user: User | null = null;
  userName: string = '';
  // toggleCam: boolean = true;
  toggleCam: boolean = false;
  toggleMic: boolean = false;
  imgSrc: string | null = '../../assets/video_off.svg';
  audioStream!: MediaStream;
  vwidth=190;
  public triggerObservable: Subject<void> = new Subject<void>();
  async ngOnInit() {
    this.authService.user$.subscribe((user: any) => {
      this.user = user;
      this.userName = user.displayName ?? user.email.split('@')[0];
      this.userName = this.userName.split(" ")[0];
      this.imgSrc = user.photoURL ?? '../../assets/video_off.svg';
    });
    this.audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    this.audioElement.nativeElement.srcObject = this.audioStream;
    this.audioElement.nativeElement.pause();
    // this.audioElement.nativeElement.play();
  }
  public handleImage(webcamImage: WebcamImage) { }

  handleToggleCam() {
    this.toggleCam = !this.toggleCam;
  }
  async handleToggleMic() {
    if (this.toggleMic) {
      this.audioElement.nativeElement.play();
    } else {
      this.audioElement.nativeElement.pause();
    }
    this.toggleMic = !this.toggleMic;
  }
}

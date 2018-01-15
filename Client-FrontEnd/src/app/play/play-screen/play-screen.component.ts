import { Component, Input } from '@angular/core';

@Component({
  selector: 'play-screen',
  templateUrl: './play-screen.component.html',
  styleUrls: ['./play-screen.component.css']
})
export class PlayScreenComponent {
  @Input() socket;
  @Input() characterName;

  constructor() { }

}

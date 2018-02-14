import { Component, Input } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'play-screen',
  templateUrl: './play-screen.component.html',
  styleUrls: ['./play-screen.component.css']
})
export class PlayScreenComponent implements OnInit {
  @Input() socket;
  @Input() characterName;

  constructor() { }

  ngOnInit(): void {}

}

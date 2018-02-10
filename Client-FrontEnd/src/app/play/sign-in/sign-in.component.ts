import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CreateCharacterComponent } from './create-character/create-character.component'

@Component({
  selector: 'sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  @Input() characterName = 'John';
  @Input() password = 'password111';
  
  @Output() playFunction = new EventEmitter<any>();
  @Output() createCharacterFunction = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  play(): void{
    this.playFunction.emit({
      characterName: this.characterName,
      password: this.password
    });
  }

  createCharacter(event): void{
    this.createCharacterFunction.emit(event);
  }

}

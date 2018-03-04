import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'create-character',
  templateUrl: './create-character.component.html',
  styleUrls: ['./create-character.component.less']
})
export class CreateCharacterComponent implements OnInit {

  @Input() characterName = '';
  @Input() password = '';
  @Input() email = '';
  
  @Output() createCharacterFunction = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  createCharacter(): void{
    this.createCharacterFunction.emit({
      characterName: this.characterName,
      password: this.password,
      email: this.email
    });
  }

}

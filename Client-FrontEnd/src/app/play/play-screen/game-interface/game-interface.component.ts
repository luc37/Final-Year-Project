import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'game-interface',
  templateUrl: './game-interface.component.html',
  styleUrls: ['./game-interface.component.css']
})
export class GameInterfaceComponent implements OnInit {
  textArea = '';

  @Input() socket;
  @Input() characterName;
  @Input() inputText;
  
  constructor() {}

  ngOnInit() {
    this.updateGame();
    this.recieveText();
  }

  ifEnter(event): void {
      this.sendText();
  }

  sendText(): void{
    const ctrl = this;

    this.textArea =  "me : " + this.inputText + "\n" + this.textArea;
    this.socket.emit('to server', ctrl.characterName + " : " + ctrl.inputText);
    this.inputText = '';
  }

  recieveText(): void{
    const ctrl = this;

    this.socket.on('from server', function(data){
      ctrl.textArea = data + "\n" + ctrl.textArea;
    });
  }

  updateGame(): void{
    const ctrl = this;

    this.socket.on('updateGame', function(data){
      ctrl.textArea = data + "\n" + ctrl.textArea;
    });
  }

}

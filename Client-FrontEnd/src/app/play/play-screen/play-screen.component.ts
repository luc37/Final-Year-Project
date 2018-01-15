import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'play-screen',
  templateUrl: './play-screen.component.html',
  styleUrls: ['./play-screen.component.css']
})
export class PlayScreenComponent implements OnInit {
  connectionCount;
  textArea = '';
  database = 'database not connected';

  @Input() socket;
  @Input() userName = 'user';
  @Input() inputText;

  constructor() { }

  ngOnInit() {
    this.getCountOfUsers();
    this.recieveText();
    this.setUpDatabase();
  }

  getCountOfUsers(): void {
    const ctrl = this;

    this.socket.on('connection count', function(data) {
      ctrl.connectionCount = data;
    });
  }

  ifEnter(event): void {
      this.sendText();
  }

  sendText(): void{
    const ctrl = this;

    this.textArea =  "me : " + this.inputText + "\n" + this.textArea;
    this.socket.emit('to server', ctrl.userName + " : " + ctrl.inputText);
    this.inputText = '';
  }

  recieveText() : void{
    const ctrl = this;

    this.socket.on('from server', function(data){
      ctrl.textArea = data + "\n" + ctrl.textArea;
    });
  }

  setUpDatabase() : void{
    const ctrl = this;

    this.socket.on('db', function(data){
      ctrl.database = data;
    });
  }

}

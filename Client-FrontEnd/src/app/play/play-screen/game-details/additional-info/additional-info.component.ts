import { Component, OnInit, Input } from '@angular/core';
import { SignInService } from '../../../../sign-in.service';
import { CurrentRoomService } from '../../../../current-room.service';
import { PlayerListService } from '../../../../player-list.service';

@Component({
  selector: 'additional-info',
  templateUrl: './additional-info.component.html',
  styleUrls: ['./additional-info.component.less']
})
export class AdditionalInfoComponent implements OnInit {

  @Input() socket;
  textArea = [];
  list = [];

  constructor(private signInService:SignInService, 
    private currentRoomService:CurrentRoomService, 
    private playerListService:PlayerListService){}

  ngOnInit() {
    const ctrl = this;

    this.socket.on('update additional info', function(arr){
      let index, change = false;

      ctrl.textArea.forEach(function (row, i){
        if(arr[0] === ctrl.list[i][0]){
          index = i;
          change = true;
        }
      });

      if(change){
       ctrl.textArea.splice(index, 1);
       ctrl.list.splice(index, 1);
      }

      ctrl.textArea.unshift(arr[1]);
      ctrl.list.unshift(arr);
    });
  }
}

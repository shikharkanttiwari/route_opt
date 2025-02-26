import { Component, Input, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

export interface Message {
  name: string;
  message: string;
  avatar: string;
}

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss'],
  imports: [MatCardModule, MatListModule],
})
export class MessengerComponent implements OnInit {
  @Input() messages: Message[] = [];
  
  constructor() { }

  ngOnInit(): void {
  }
}
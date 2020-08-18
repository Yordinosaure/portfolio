import { Component, OnInit } from '@angular/core';
import { DataExchangeService } from 'src/app/core/services/DataExchange/data-exchange.service';

@Component({
  selector: 'app-soft-skills',
  templateUrl: './soft-skills.component.html',
  styleUrls: ['./soft-skills.component.scss']
})
export class SoftSkillsComponent implements OnInit {

  startY: number;
  endY: number;

  constructor(private dataEx: DataExchangeService) { }

  ngOnInit(): void {
    this.startY = document.getElementById('soft-skills').offsetTop;
    this.endY = this.startY + document.getElementById('soft-skills').offsetHeight;
    this.dataEx.addData(this.endY);
  }

}

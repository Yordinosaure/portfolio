import { Component, OnInit } from '@angular/core';
import { DataExchangeService } from 'src/app/core/services/DataExchange/data-exchange.service';
import { DisplayData } from 'src/app/core/models/displayData.model';

@Component({
  selector: 'app-soft-skills',
  templateUrl: './soft-skills.component.html',
  styleUrls: ['./soft-skills.component.scss']
})
export class SoftSkillsComponent implements OnInit {

  startY: number;
  endY: number;
  displayData: DisplayData;

  constructor(private dataEx: DataExchangeService) { }

  ngOnInit(): void {
    this.startY = document.getElementById('soft-skills').offsetTop;
    this.endY = this.startY + document.getElementById('soft-skills').offsetHeight;
    // this.dataEx.addData(this.endY);

    this.displayData = new DisplayData('soft-skills', this.startY, this.endY, -0.4,0,0, false, 0);
    this.dataEx.addDisplayData(this.displayData)
  }

}

import { Component, OnInit, HostListener } from '@angular/core';
import { runInThisContext } from 'vm';
import { ThreeDService } from 'src/app/core/services/three-d.service';
import { CheckPoint } from 'src/app/core/models/checkPoints.model';
import { DataExchangeService } from 'src/app/core/services/DataExchange/data-exchange.service';

@Component({
  selector: 'app-hard-skills',
  templateUrl: './hard-skills.component.html',
  styleUrls: ['./hard-skills.component.scss']
})
export class HardSkillsComponent implements OnInit {

  
  checkPoint: CheckPoint;
  startY: number;
  endY: number;
  scrollY = 0;
  scrolling = false;


  constructor(private threeDService: ThreeDService, private dataEx: DataExchangeService) { }

  ngOnInit(): void {
    this.startY = document.getElementById('hard-skills').offsetTop;
    this.endY = this.startY + document.getElementById('hard-skills').offsetHeight;
    this.dataEx.addData(this.endY);
    console.log('endpos', this.endY)
    // console.log('hard start point',this.startY);
    this.checkPoint = new CheckPoint('hard', this.startY, this.endY, 0, -0.1, 2, -2);
    this.threeDService.addCheckPoint(this.checkPoint);
  }



}

import { Component, OnInit } from '@angular/core';
import { runInThisContext } from 'vm';
import { ThreeDService } from 'src/app/core/services/three-d.service';
import { CheckPoint } from 'src/app/core/models/checkPoints.model';

@Component({
  selector: 'app-hard-skills',
  templateUrl: './hard-skills.component.html',
  styleUrls: ['./hard-skills.component.scss']
})
export class HardSkillsComponent implements OnInit {

  startY: number;
  checkPoint: CheckPoint;

  constructor(private threeDService: ThreeDService) { }

  ngOnInit(): void {
    this.startY = document.getElementById('startHard').offsetTop;
    console.log('hard start point',this.startY);
    this.checkPoint = new CheckPoint('hard', this.startY, 0, 0, 0, 0);
    this.threeDService.addCheckPoint(this.checkPoint);
  }

}

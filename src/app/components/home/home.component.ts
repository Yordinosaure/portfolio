import { Component, OnInit } from '@angular/core';
import { LoggerService } from 'src/app/core/services/logger.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  test: number = 4;
  
  constructor(private logger: LoggerService) { }

  ngOnInit(): void {
    this.logger.log(5);
    this.logger.log(this.test, 'test', 'green');    
  }

}

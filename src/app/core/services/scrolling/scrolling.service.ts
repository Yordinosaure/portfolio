import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DisplayData } from '../../models/displayData.model';
import { DataExchangeService } from '../DataExchange/data-exchange.service';

@Injectable({
  providedIn: 'root'
})
export class ScrollingService {

  scrollY = 0;
  scrolling = false;
  actualY: number = 1;
  $displayDataArray: Observable<DisplayData[]>;
  displayDataArray: DisplayData[] = [];
  currentDisplayData : DisplayData;

  constructor(private dataEx: DataExchangeService) { 
    this.init()
  }

  init(): void {
    this.$displayDataArray = this.dataEx.displayData$;
    this.$displayDataArray.subscribe(x=> {
      this.displayDataArray = x;
      // console.log('scrolling',this.displayDataArray)
      if(this.displayDataArray.length>0){

        this.getActualPos();
      }
    });   
  }

  getActualPos() {
    this.actualY = document.documentElement.scrollTop;
    // console.log('actualY',this.actualY);
    // console.log(this.displayDataArray);
    if(!this.scrolling) {
      this.currentDisplayData = this.displayDataArray.find(x=> x.offsetValueStart <= this.actualY && x.offsetValueEnd >= this.actualY);
      // console.log(this.currentDisplayData);   
    }
  }

  scroll(deltaY: number): void {
    this.getActualPos();
    this.scrolling = true;
    if (deltaY > 0) {
      window.scrollTo({
        top: this.scrollY += 5,
        left: 0,
        behavior: 'smooth'
      });
      if (this.scrollY < this.currentDisplayData.offsetValueEnd) {
        setTimeout(() => { this.scroll(deltaY) }, 10)
      }
      else {
        this.scrolling = false;
      }
    } 
    else if(deltaY < 0){
      window.scrollTo({
        top: this.scrollY -= 5,
        left: 0,
        behavior: 'smooth'
      });
      if (this.scrollY > this.currentDisplayData.offsetValueStart) {
        setTimeout(() => { this.scroll(deltaY) }, 10)
      } else {
        this.scrolling = false;
      }
    }
  }
}

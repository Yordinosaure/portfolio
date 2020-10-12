import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DisplayData } from '../../models/displayData.model';

@Injectable({
  providedIn: 'root'
})
export class DataExchangeService {

  // componentsDataSubj: BehaviorSubject<any[]> = new BehaviorSubject([0]);
  // componentsData = this.componentsDataSubj.asObservable();

  displayDataSubj$: BehaviorSubject<DisplayData[]> = new BehaviorSubject([]);
  displayData$: Observable<DisplayData[]> = this.displayDataSubj$.asObservable();

  constructor() { }

  // addData(data: any) {
  //   this.componentsDataSubj.next([...this.componentsDataSubj.getValue(),data]);
  //   // console.log(this.componentsDataSubj.getValue())
  // }

  addDisplayData(data: DisplayData) {
    this.displayDataSubj$.next([...this.displayDataSubj$.getValue(), data]);
    // console.log(this.displayDataSubj$.getValue())
    // console.log(this.displayData.)
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataExchangeService {

  componentsDataSubj: BehaviorSubject<any[]> = new BehaviorSubject([0]);
  componentsData = this.componentsDataSubj.asObservable();

  constructor() { }

  addData(data: any) {
    this.componentsDataSubj.next([...this.componentsDataSubj.getValue(),data]);
    console.log(this.componentsDataSubj.getValue())
  }
}

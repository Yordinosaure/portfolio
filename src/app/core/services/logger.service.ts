import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  log(logVar: any) {
    if(!environment.production){
      console.log(logVar);
    }
  }
}

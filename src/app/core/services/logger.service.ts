import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  log(logVar: any, message: string = '',  style: string = 'black') {
    if(!environment.production){
      console.log(`%c${message? message + ' :': ''}${logVar}`, `color : ${style};`);
    }
  }

  dir(logVar: any) {
    if(!environment.production){
      console.dir(logVar);
    }
  }
}

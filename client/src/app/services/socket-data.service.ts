import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataPoint } from '../models/data-point';

@Injectable({
  providedIn: 'root'
})
export class SocketDataService {

  constructor(private socket: Socket) {}

  getData(): Observable<DataPoint> {
    return this.socket
             .fromEvent<DataPoint>('new data')
             .pipe(map(data => {
               return new DataPoint(data);
             }));
  }

  send(eventName: string, value: number): void {
    this.socket.emit(eventName, value);
  }

}

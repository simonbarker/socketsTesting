import * as moment from 'moment';

export class DataPoint {
  timeStamp?: moment.Moment;
  value?: number;

  constructor(obj) {
    this.timeStamp = obj.timeStamp ? moment(obj.timeStamp) : null;
    this.value = obj.value ? obj.value : null;
  }
}

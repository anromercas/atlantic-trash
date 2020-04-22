import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DatesMockService {
  today: string = '2019-05-15';
  locale: string = 'es';

  week = {
    from: moment(this.today)
      .locale(this.locale)
      .startOf('week'),
    to: moment(this.today)
      .locale(this.locale)
      .endOf('week')
  };

  month = {
    from: moment(this.today)
      .locale(this.locale)
      .startOf('month'),
    to: moment(this.today)
      .locale(this.locale)
      .endOf('month')
  };

  year = {
    from: moment(this.today)
      .locale(this.locale)
      .startOf('year'),
    to: moment(this.today)
      .locale(this.locale)
      .endOf('year')
  };

  constructor() {}

  getWeek = () => this.week;
  getMonth = () => this.month;
  getYear = () => this.year;
}

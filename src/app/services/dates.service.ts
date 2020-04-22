import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DatesService {
  // today: string = '';
  today: string = moment().format('YYYY-MM-DD');
  todayMoment: moment.Moment = moment();
  locale: string = 'es';

  week: DateFromTo = {
    from: moment(this.today)
      .locale(this.locale)
      .startOf('week'),
    to: moment(this.today)
      .locale(this.locale)
      .endOf('week')
  };

  month: DateFromTo = {
    from: moment(this.today)
      .locale(this.locale)
      .startOf('month'),
    to: moment(this.today)
      .locale(this.locale)
      .endOf('month')
  };

  year: DateFromTo = {
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

interface DateFromTo {
  from: moment.Moment;
  to: moment.Moment;
}

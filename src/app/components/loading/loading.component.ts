import { Component, OnInit } from '@angular/core';
import { LoadingService, LoaderState } from 'src/app/services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  subscription: any;
  constructor(public loadingService: LoadingService) {}

  show: boolean;

  ngOnInit() {
    this.subscription = this.loadingService.loaderState.subscribe(
      (state: LoaderState) => {
        this.show = state.show;
      }
    );
  }

  OnDestroy() {
    this.subscription.unsubscribe();
  }
}

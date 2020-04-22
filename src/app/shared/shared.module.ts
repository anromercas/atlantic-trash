import { NgModule } from '@angular/core';

// Paginas
import { NofoundpageComponent } from './nofoundpage/nofoundpage.component';
import { HeaderComponent } from './header/header.component';
import { PAGES_ROUTES } from '../pages/pages.routes';

@NgModule({
    declarations: [
        NofoundpageComponent,
        HeaderComponent,
    ],
    exports: [
        NofoundpageComponent,
        HeaderComponent,
    ],
    imports: [
        PAGES_ROUTES
    ]
})
export class SharedModule { }

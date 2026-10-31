import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { Tab1Page } from './tab1.page';

@NgModule({
  imports: [
    CommonModule,
    Tab1PageRoutingModule,
    Tab1Page
  ]
})
export class Tab1PageModule {}
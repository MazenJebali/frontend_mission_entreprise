import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActualiteRoutingModule } from './actualite-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ActualitePlaceholderComponent } from './components/actualite-placeholder/actualite-placeholder.component';

@NgModule({
  declarations: [
    ActualitePlaceholderComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ActualiteRoutingModule
  ]
})
export class ActualiteModule {}

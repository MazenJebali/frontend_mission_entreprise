import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActualitePlaceholderComponent } from './components/actualite-placeholder/actualite-placeholder.component';

const routes: Routes = [
  { path: '', component: ActualitePlaceholderComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActualiteRoutingModule {}

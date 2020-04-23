import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { OtherPageComponent } from './other-page/other-page.component';

const routes: Routes = [
  {path:"",component:MainPageComponent},
  {path:"other",component:OtherPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import {  ChartsModule } from 'ng2-charts'
import { AdminRoutingModule } from "../admin/admin-routing.module";
import { TimesBoughtComponent } from './charts/times-bought/times-bought.component';


@NgModule({
  declarations: [AdminComponent, TimesBoughtComponent],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    ChartsModule
  ]
})
export class AdminModule { }

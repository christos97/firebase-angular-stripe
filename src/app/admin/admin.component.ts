import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AdminService } from "../services/admin.service";
import { TimesBoughtComponent } from "./charts/times-bought/times-bought.component";
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit {

  constructor(public adminService: AdminService) { }

  public data

  ngOnInit(): void {


  }

  @ViewChild(TimesBoughtComponent, {static: false}) timesBoughtChart: TimesBoughtComponent
  ngAfterViewInit(){
    console.log(this.timesBoughtChart)
  }
}

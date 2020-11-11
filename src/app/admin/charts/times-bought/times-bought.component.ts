import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { AdminService } from 'src/app/services/admin.service';
import { _COURSES, _BAR_CHART_COLORS } from "../../../../settings/courses.config";
@Component({
  selector: 'times-bought-chart',
  templateUrl: './times-bought.component.html',
  styleUrls: ['./times-bought.component.scss']
})
export class TimesBoughtComponent implements OnInit {

  public barChartData: ChartDataSets[] = [
    { data: [0, 0, 0, 0], label: 'Times Bought', barThickness: 60, barPercentage: 0.1 },
  ];
  public barChartLabels: Label[] = _COURSES
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { yAxes: [{ ticks: { beginAtZero: true } }] }
  };
  public barChartColors: Color[] = _BAR_CHART_COLORS
  public barChartLegend = true;
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [];

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.getAllCourses().subscribe(
      courses =>{
        let t = courses.map( v => {
          return {
            times_bought:  parseInt((v.times_bought).toString()),
            title: v.title
          }
        })
        console.log(t)
        this.barChartData[0].data = t.map(v=> v.times_bought)
        this.barChartLabels = t.map(v => v.title)
    })
  }

}

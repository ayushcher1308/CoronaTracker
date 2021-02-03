import { Component, OnInit, ViewChild } from '@angular/core';
// import { ChartComponent } from 'ng-apexcharts';
import { HttpService } from '../services/http.service';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexYAxis,
  ApexTooltip,
  ApexTitleSubtitle,
  ApexXAxis
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  title: ApexTitleSubtitle;
  labels: string[];
  stroke: any; // ApexStroke;
  dataLabels: any; // ApexDataLabels;
  fill: ApexFill;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptions> | undefined;
  constructor(private httpData: HttpService) { this.updateChart(); }


  countryData: any;
  timeline:any;
  totalConfirmed = 0;
  totalRecovered = 0;
  totalDeath = 0;
  totalAll = 0;
  loader = true;
  pieArray: any;
  countrySelected = "All Countries";
  selected=false;
  ngOnInit(): void {
    this.updateHome();
  }

  updateChart() {
    this.chartOptions = {
      series: [
        {
          name: "Website Blog",
          type: "line",
          data: []
        }
      ],
      chart: {
        height: 250,
        type: "line"
      },
      stroke: {
        width: [0, 1]
      },
      title: {
        text: "Corona Tracker"
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1]
      },
      labels: [ ],
      xaxis: {
        type: "datetime",
        labels:{
          show:false,
          rotate:180
        }
      },
      yaxis: [
        {
          title: {
            text: "Active Cases"
          }
        }
      ]
    };
  }


  updateHome() {
    this.totalConfirmed = 0;
    this.totalRecovered = 0;
    this.totalDeath = 0;
    this.httpData.getData().subscribe(Response => {
      console.log(Response);
      this.countryData = Response.data;
      Response.data.forEach((element: { latest_data: { confirmed: number; recovered: number; deaths: number; }; }) => {
        this.totalConfirmed += element.latest_data.confirmed;
        this.totalRecovered += element.latest_data.recovered;
        this.totalDeath += element.latest_data.deaths;
        this.totalAll = this.totalConfirmed - this.totalDeath - this.totalRecovered;
        // this.updatePieValue();
        this.loader = false;

      });
    });
  }

  selectedCountry(value: any) {
    this.loader = true;
    this.selected = false;
    if (value == "all") {
      this.totalConfirmed = 0;
      this.totalRecovered = 0;
      this.totalDeath = 0;
      this.countryData.forEach((element: { latest_data: { confirmed: number; recovered: number; deaths: number; }; }) => {
        this.totalConfirmed += element.latest_data.confirmed;
        this.totalRecovered += element.latest_data.recovered;
        this.totalDeath += element.latest_data.deaths;
        this.totalAll = this.totalConfirmed - this.totalDeath - this.totalRecovered;
        // this.updatePieValue();
        this.loader = false;

      });
    }
    else {
      this.httpData.getDataCountry(value).subscribe(Response => {
        let element = Response.data;
        console.log(Response);
        this.totalConfirmed = element.latest_data.confirmed;
        this.totalRecovered = element.latest_data.recovered;
        this.totalDeath = element.latest_data.deaths;
        this.totalAll = this.totalConfirmed - this.totalDeath - this.totalRecovered;
        this.timeline = element.timeline;
        this.updatePieValue(element.name);
        this.selected = true;
        this.loader = false;
      })
    }
  }

  updatePieValue(country:any) {
    // this.pieArray = [this.totalConfirmed, this.totalDeath, this.totalRecovered,this.totalAll];
    // this.chartOptions.series = this.pieArray;
      let XAxis=[],YAxis=[];
      for(var i=0;i<this.timeline.length;i++){
          XAxis.push(this.timeline[i].date);
          YAxis.push(this.timeline[i].active);
      }
      this.chartOptions.series = [
        {
          name: country,
          type: "line",
          data: YAxis
        }
      ];
      this.chartOptions.labels = XAxis;

      
  }

}

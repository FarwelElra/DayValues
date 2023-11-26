import {Component} from '@angular/core';
import Chart from 'chart.js/auto';
import {ApiService} from "../../services/api.service";
import {DayValues} from "../../dto/dayValues/dayValues";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent {

  data: DayValues[] = [];

  date: string[] = [];
  sys: number[] = [];
  dia: number[] = [];
  pulse: number[] = [];
  weight: number[] = [];
  constructor(private api: ApiService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.api.loadAllDayValues().subscribe({
      next: value => {
        this.data = value;
        this.extractData();
        this.createCharts();
      },
      complete: () => this.createCharts()
    });
  }

  private extractData() {
    this.date = this.data.map(value => this.formatDate(value.date));
    this.sys = this.data.map(value => value.sys);
    this.dia = this.data.map(value => value.dia);
    this.pulse = this.data.map(value => value.pulse);
    this.weight = this.data.map(value => value.weight);
  }
  public chart: any;
  private formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd.MM.yyyy') || '';
  }
  createCharts() {
    if (this.data.length === 0) {
      return;
    }
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.data.map(value => value.date.toString());
    this.chart = new Chart("MyChart", {
      data: {// values on X-Axis
        labels: labels,
        datasets: [
          { type: 'line', label: "Sys", data: this.sys },
          { type: 'line', label: "Dia", data: this.dia },
          { type: 'line', label: "Pulse", data: this.pulse },
          { type: 'line', label: "Weight", data: this.weight }
        ]

      },
      options: {aspectRatio: 2.5}
    });
  }
}



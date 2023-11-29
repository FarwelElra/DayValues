import {Component, OnInit} from '@angular/core';
import Chart from 'chart.js/auto';
import {DayValues} from "../../dto/dayValues/dayValues";
import {DatePipe} from "@angular/common";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  constructor(
    private datePipe: DatePipe,
    private data: DataService) {
  }

  public chart: any;

  private formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd.MM.yyyy') || '';
  }

  createCharts(values: DayValues[]) {
    if (this.chart) {
      this.chart.destroy();
    }
    let sorted = values.sort(this.dateComparator);
    let date = sorted.map(value => this.formatDate(value.date));
    let sys = sorted.map(value => value.sys);
    let dia = sorted.map(value => value.dia);
    let pulse = sorted.map(value => value.pulse);
    let weight = sorted.map(value => value.weight);
    this.chart = new Chart("MyChart", {
      data: {// values on X-Axis
        labels: date,
        datasets: [
          {type: 'line', label: "Sys", data: sys},
          {type: 'line', label: "Dia", data: dia},
          {type: 'line', label: "Pulse", data: pulse},
          {type: 'line', label: "Weight", data: weight}
        ]

      },
      options: {aspectRatio: 2.5}
    });
  }

  dateComparator = (a: DayValues, b: DayValues) => {
    if (a.date > b.date) {
      return 1;
    }
    if (a.date < b.date) {
      return -1;
    }
    return 0;
  }

  ngOnInit(): void {
    this.data.outputValues.subscribe({
        next: values => this.createCharts(values)
      }
    )
  }
}

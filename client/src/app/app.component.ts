import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, AfterViewInit } from '@angular/core';
import { SocketDataService } from './services/socket-data.service';
import { Observable } from 'rxjs';
import { DataPoint } from './models/data-point';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  dataPoint: DataPoint;
  dataLog: number[] = [0];
  displayData: number[] = [0];
  dataViewWindow = 50;

  @ViewChild('dataChart', {static: false}) dataChartCanvas: ElementRef;
  private dataChart: Chart;

  constructor(private socketDataService: SocketDataService) {}

  ngOnInit() {
    this.socketDataService.getData().subscribe(data => {
      if (!data.value) {
        return;
      }

      // clear out starting value
      this.dataPoint = data;
      (this.dataLog.length === 1 && this.dataLog[0] === 0) ?
          this.dataLog[0] = data.value : this.dataLog.push(data.value);

      // set the xAxis labels
      let xRange = this.RANGE(1, this.dataLog.length);

      // set the display data and limit window to latest X values
      this.displayData = JSON.parse(JSON.stringify(this.dataLog));
      if (this.dataLog.length > this.dataViewWindow) {
        this.displayData = this.displayData.splice(-this.dataViewWindow);
        xRange = xRange.splice(-this.dataViewWindow);
      }

      // set the chart data
      this.dataChart.data.datasets.forEach(dataset => {
        dataset.data = this.displayData;
      });
      this.dataChart.data.labels = xRange;
      this.dataChart.update();
    });
  }

  viewWindowSliderChanged(event: MatSliderChange) {
    this.dataViewWindow = event.value;
  }

  verticalOffsetSliderChanged(event: MatSliderChange) {
    this.socketDataService.send('vertical offset', event.value);
  }
  noiseSliderChanged(event: MatSliderChange) {
    this.socketDataService.send('noise', event.value);
  }
  sampleTimeSliderChanged(event: MatSliderChange) {
    this.socketDataService.send('sample time', event.value);
  }

  ngAfterViewInit() {
    let graphLineColorMain = '#5260ff';
    let graphLineColorShade = '#444444';

    this.dataChart = new Chart(this.dataChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.RANGE(1, this.dataLog.length),
        datasets: [
          {
            data: this.displayData,
            label: 'Round times',
            fill: false,
            backgroundColor: graphLineColorMain,
            borderColor: graphLineColorMain,
            lineTension: 0.1,
            borderWidth: 2,
            pointRadius: 2,
            pointHoverRadius: 5
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
            yAxes: [{
              gridLines: {
                drawOnChartArea: false,
                drawBorder: true,
                color: graphLineColorShade
              },
              scaleLabel: {
                display: true,
                labelString: 'Time (mm:ss)',
                fontColor: graphLineColorShade
              },
              // ticks: {
              //   maxTicksLimit: 5,
              //   suggestedMin: Math.max(...this.dataLog) * 0.5,
              //   suggestedMax: Math.max(...this.dataLog) * 1.2,
              //   callback: (label, index, labels) => {
              //     return moment(label).format('m:ss');
              //   },
              //   fontColor: graphLineColorShade
              // }
            }],
            xAxes: [{
              gridLines: {
                drawOnChartArea: false,
                drawBorder: true,
                color: graphLineColorShade
              },
              scaleLabel: {
                display: true,
                labelString: 'Round',
                fontColor: graphLineColorShade
              },
              ticks: {
                beginAtZero: true,
                fontColor: graphLineColorShade
              }
            }]
        },
        tooltips : {
          custom: (tooltip) => {
            if (!tooltip) { return; }
            // disable displaying the color box;
            tooltip.displayColors = false;
          },
          callbacks: {
            beforeTitle: (tooltipItem, data) => {
              return '';
            },
            title: (tooltipItem, data) => {
              return '';
            },
            afterTitle: (tooltipItem, data) => {
              return '';
            },
            beforeBody: (tooltipItem, data) => {
              return '';
            },
            beforeLabel: (tooltipItem, data) => {
              return '';
            },
            label: (tooltipItem, data) => {
              return moment(+tooltipItem.value).format('m[m] ss.SS[s]');
            },
            afterLabel: (tooltipItem, data) => {
              return '';
            },
            afterBody: (tooltipItem, data) => {
              return '';
            },
            beforeFooter: (tooltipItem, data) => {
              return '';
            },
            footer: (tooltipItem, data) => {
              return '';
            },
            afterFooter: (tooltipItem, data) => {
              return '';
            }
          }
        }
    }
    });
  }

  RANGE = (x, y) => Array.from((function*() {
    while (x <= y) { yield x++; }
  })())

}

import {Component, OnInit} from '@angular/core';
import {IndexInput} from './DataModel';
import {NetworkService} from './network.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  indexInput: IndexInput = {
    inputKeyword: '',
    inputCategory: 'all',
    inputDistance: '',
    distanceMeasure: 'miles',
    inputFrom: 'current',
    inputOther: '',
    lat: undefined,
    lon: undefined
  };
  error: any;
  autoComplete: any;
  results: any;
  canRun = true;
  selectedMainPanel = true;
  storedEvents: any[] = [];

  // myControl = new FormControl();
  constructor(private networkService: NetworkService) {
  }

  ngOnInit(): void {
    this.getGeo();
    document.getElementById('submit').setAttribute('disabled', '');
    if (!JSON.parse(localStorage.getItem('events'))) {
      localStorage.setItem('events', JSON.stringify(this.storedEvents));
    } else {
      this.storedEvents = JSON.parse(localStorage.getItem('events'));
    }
    console.log(this.storedEvents);
  }

  getGeo(): void {
    this.networkService.getIpAPI().subscribe(data => {
      this.indexInput.lat = data['lat'];
      this.indexInput.lon = data['lon'];
      document.getElementById('submit').removeAttribute('disabled');
      console.log(this.indexInput);
    }, error => {
      this.error = error;
      console.log(this.error);
    });
  }

  checkKeywordBlur() {
    if (!/\w+/.test(this.indexInput.inputKeyword)) {
      document.getElementById('inputKeyword').classList.add('is-invalid');
    }
  }

  keywordChangeThrottle() {
    if (/\w+/.test(this.indexInput.inputKeyword)) {
      document.getElementById('inputKeyword').classList.remove('is-invalid');
    }
    if (!this.canRun) {
      return;
    }
    this.canRun = false;
    setTimeout(() => {
      this.keywordChange();
      this.canRun = true;
    }, 1000);
  }

  keywordChange() {
    if (/\w+/.test(this.indexInput.inputKeyword)) {
      this.networkService.reqAuto(this.indexInput.inputKeyword).subscribe(data => {
        console.log('Requested');
        try {
          this.autoComplete = data['_embedded']['attractions'];
        } catch (e) {
          this.autoComplete = undefined;
        }
        // console.log(this.autoComplete);
      });
    } else {
      this.autoComplete = undefined;
      // document.getElementById('inputKeyword').classList.add('is-invalid');
    }
  }

  checkOther() {
    if (this.indexInput.inputFrom === 'other') {
      if (/\w+/.test(this.indexInput.inputOther)) {
        document.getElementById('inputOther').classList.remove('is-invalid');
      }
    } else {
      document.getElementById('inputOther').classList.remove('is-invalid');
    }
  }

  checkOtherBlur() {
    if (!/\w+/.test(this.indexInput.inputOther)) {
      document.getElementById('inputOther').classList.add('is-invalid');
    }
  }

  checkValidInput(): boolean {
    if (/\w+/.test(this.indexInput.inputKeyword)) {
      if (this.indexInput.inputFrom === 'current' && this.indexInput.lat !== undefined) {
        return true;
      } else if (/\w+/.test(this.indexInput.inputOther)) {
        return true;
      }
    }
    return false;
  }

  submitForm() {
    if (this.checkValidInput()) {
      this.results = 'loading';
      this.networkService.sendForm(this.indexInput).subscribe(data => {
          // console.log(data);
          if (data.hasOwnProperty('_embedded')) {
            this.results = data['_embedded']['events'];
            const x = this.results;
            x.sort(function (a, b) {
              return Date.parse(a['dates']['start']['localDate']) - Date.parse(b['dates']['start']['localDate']); // 时间正序
            });
            console.log(this.results);
            return;
          }
          this.results = 'NULL';
        },
        err => {
          this.results = 'ERR';
        });
    }
  }

  reset() {
    this.indexInput.inputKeyword = '';
    this.indexInput.inputCategory = 'all';
    this.indexInput.inputDistance = '';
    this.indexInput.distanceMeasure = 'miles';
    this.indexInput.inputFrom = 'current';
    this.indexInput.inputOther = '';
    this.results = undefined;
  }
}

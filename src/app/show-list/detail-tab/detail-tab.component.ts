import {Component, Input, OnInit, Renderer2} from '@angular/core';
import {trigger, transition, animate, style, query, stagger} from '@angular/animations';

@Component({
  selector: 'app-detail-tab',
  templateUrl: './detail-tab.component.html',
  styleUrls: ['./detail-tab.component.css'],
  animations: [
    trigger('filterAnimation', [
      transition(':enter, * => 0, * => -1', []),
      transition(':increment', [
        query(':enter', [
          style({opacity: 0, width: '0px'}),
          stagger(50, [
            animate('300ms ease-out', style({opacity: 1, height: '*', width: '*'})),
          ]),
        ], {optional: true})
      ]),
      transition(':decrement', [
        query(':leave', [
          stagger(50, [
            animate('300ms ease-out', style({opacity: 0, height: '0px'})),
          ]),
        ], {optional: true})
      ]),
    ]),
  ]
})

export class DetailTabComponent implements OnInit {
  @Input() event: any;
  @Input() venueInfo: any;
  @Input() googlePics: any;
  @Input() spotifyResults: any;
  venueInfoAlias: any;
  selectedTab: string;
  resetDetailTab: Function;
  // resetVenueInfo: Function;
  sortIndex = 'default';
  sortDirection = 'ascend';
  end = 5;

  constructor(renderer: Renderer2) {
    this.selectedTab = 'event';
    this.resetDetailTab = renderer.listen(document.getElementById('submit'), 'click', (evt) => {
      this.selectedTab = 'event';
      this.sortIndex = 'default';
      this.sortDirection = 'ascend';
      this.end = 5;
    });
  }

  ngOnInit() {
  }



  getArtistTeam() {
    // console.log(this.event);
    let ans = '';
    if (this.event['_embedded'] && this.event['_embedded']['attractions']) {
      let first = true;
      for (const s of this.event['_embedded']['attractions']) {
        if (first) {
          first = false;
        } else {
          ans += ' | ';
        }
        ans += s.name;
      }
    }
    if (ans === '') {
      ans = 'N/A';
    }
    return ans;
  }

  getVenue() {
    if (this.event['_embedded'] && this.event['_embedded']['venues'] && this.event['_embedded']['venues'][0]) {
      if (this.event['_embedded']['venues'][0]['name']) {
        return this.event['_embedded']['venues'][0]['name'];
      }
    }
    return 'N/A';
  }

  getTime() {
    let ans = '';
    if (this.event['dates'] && this.event['dates']['start']) {
      if (this.event['dates']['start']['localDate']) {
        ans += this.event['dates']['start']['localDate'] + ' ';
      }
      if (this.event['dates']['start']['localTime']) {
        ans += this.event['dates']['start']['localTime'];
      }
    }
    if (ans === '') {
      return 'N/A';
    } else {
      return ans;
    }
  }

  getCat() {
    let ans = '';
    if (this.event['classifications']) {
      if (this.event['classifications'][0]['genre'] && this.event['classifications'][0]['genre']['name'] !== 'Undefined') {
        ans += this.event['classifications'][0]['genre']['name'];
        if (this.event['classifications'][0]['segment'] && this.event['classifications'][0]['segment']['name'] !== 'Undefined') {
          ans += ' | ';
        }
      }
      if (this.event['classifications'][0]['segment'] && this.event['classifications'][0]['segment']['name'] !== 'Undefined') {
        ans += this.event['classifications'][0]['segment']['name'];
      }
    }
    if (ans === '') {
      return 'N/A';
    }
    return ans;
  }

  getPrice() {
    let ans = '';
    if (this.event['priceRanges'] && this.event['priceRanges'][0]) {
      if (this.event['priceRanges'][0]['min']) {
        ans += '$' + this.event['priceRanges'][0]['min'];
      }

      if (this.event['priceRanges'][0]['max']) {
        if (ans !== '') {
          ans += ' ~ ';
        }
        ans += '$' + this.event['priceRanges'][0]['max'];
      }
    }
    if (ans === '') {
      return 'N/A';
    } else {
      return ans;
    }
  }

  getStatus() {
    let ans = '';
    if (this.event['dates'] && this.event['dates']['status'] && this.event['dates']['status']['code']) {
      ans = this.event['dates']['status']['code'];
    }
    if (ans === '') {
      return 'N/A';
    }
    return ans;
  }

  getUrl() {
    let ans = '';
    if (this.event['url']) {
      ans = this.event['url'];
    }
    return ans;
  }

  getSeatUrl() {
    let ans = '';
    if (this.event['seatmap'] && this.event['seatmap']['staticUrl']) {
      ans = this.event['seatmap']['staticUrl'];
    }
    return ans;
  }

  checkVenue() {
    return !!(this.event['_embedded'] && this.event['_embedded']['venues'] && this.event['_embedded']['venues'][0]);
  }

  getAddress() {
    if (this.event['_embedded']['venues'][0]['address'] && this.event['_embedded']['venues'][0]['address']['line1']) {
      return this.event['_embedded']['venues'][0]['address']['line1'];
    }
    return 'N/A';
  }

  getCity() {
    let ans = '';
    if (this.event['_embedded']['venues'][0]['city'] && this.event['_embedded']['venues'][0]['city']['name']) {
      ans += this.event['_embedded']['venues'][0]['city']['name'];
    }
    if (this.event['_embedded']['venues'][0]['state'] && this.event['_embedded']['venues'][0]['state']['name']) {
      if (ans !== '') {
        ans += ', ';
      }
      ans += this.event['_embedded']['venues'][0]['state']['name'];
    }
    if (ans !== '') {
      return ans;
    }
    return 'N/A';
  }

  getPhoneNumber() {
    if (this.event['_embedded']['venues'][0]['boxOfficeInfo']) {
      if (this.event['_embedded']['venues'][0]['boxOfficeInfo']['phoneNumberDetail']) {
        return this.event['_embedded']['venues'][0]['boxOfficeInfo']['phoneNumberDetail'];
      }
    }
    return 'N/A';
  }

  getOpenHours() {
    if (this.event['_embedded']['venues'][0]['boxOfficeInfo'] && this.event['_embedded']['venues'][0]['boxOfficeInfo']['openHoursDetail']) {
      return this.event['_embedded']['venues'][0]['boxOfficeInfo']['openHoursDetail'];
    }
    return 'N/A';
  }

  getGeneralRule() {
    if (this.event['_embedded']['venues'][0]['generalInfo'] && this.event['_embedded']['venues'][0]['generalInfo']['generalRule']) {
      return this.event['_embedded']['venues'][0]['generalInfo']['generalRule'];
    }
    return 'N/A';
  }

  getChildRule() {
    if (this.event['_embedded']['venues'][0]['generalInfo'] && this.event['_embedded']['venues'][0]['generalInfo']['childRule']) {
      return this.event['_embedded']['venues'][0]['generalInfo']['childRule'];
    }
    return 'N/A';
  }

  checkPosition() {
    if (this.event['_embedded']['venues'][0]['location'] && this.event['_embedded']['venues'][0]['location']['longitude']) {
      if (this.event['_embedded']['venues'][0]['location']['latitude']) {
        return true;
      }
    }
    return false;
  }

  sortAgain() {
    // console.log(this.venueInfoAlias);
    if (this.venueInfoAlias === undefined) {
      this.venueInfoAlias = JSON.parse(JSON.stringify(this.venueInfo));
    }
    if (this.sortIndex === 'default') {
      this.venueInfo = JSON.parse(JSON.stringify(this.venueInfoAlias));
    }
    if (this.sortIndex === 'eventName') {
      const x = this.venueInfo['event'];
      if (this.sortDirection === 'ascend') {
        x.sort(function (a, b) {
          if (a['displayName'] < b['displayName']) {
            return -1;
          }
          if (a['displayName'] > b['displayName']) {
            return 1;
          }
          return 0;
        });
      } else {
        x.sort(function (a, b) {
          if (a['displayName'] < b['displayName']) {
            return 1;
          }
          if (a['displayName'] > b['displayName']) {
            return -1;
          }
          return 0;
        });
      }
    }
    if (this.sortIndex === 'time') {
      const x = this.venueInfo['event'];
      if (this.sortDirection === 'ascend') {
        x.sort(function (a, b) {
          return Date.parse(a['start']['date']) - Date.parse(b['start']['date']);
        });
      } else {
        x.sort(function (a, b) {
          return Date.parse(b['start']['date']) - Date.parse(a['start']['date']);
        });
      }
    }
    if (this.sortIndex === 'artist') {
      const x = this.venueInfo['event'];
      if (this.sortDirection === 'ascend') {
        x.sort(function (a, b) {
          if (a['performance'][0]['displayName'] < b['performance'][0]['displayName']) {
            return -1;
          }
          if (a['performance'][0]['displayName'] > b['performance'][0]['displayName']) {
            return 1;
          }
          return 0;
        });
      } else {
        x.sort(function (a, b) {
          if (a['performance'][0]['displayName'] < b['performance'][0]['displayName']) {
            return 1;
          }
          if (a['performance'][0]['displayName'] > b['performance'][0]['displayName']) {
            return -1;
          }
          return 0;
        });
      }
    }
    if (this.sortIndex === 'type') {
      const x = this.venueInfo['event'];
      if (this.sortDirection === 'ascend') {
        x.sort(function (a, b) {
          if (a['type'] < b['type']) {
            return -1;
          }
          if (a['type'] > b['type']) {
            return 1;
          }
          return 0;
        });
      } else {
        x.sort(function (a, b) {
          if (a['type'] < b['type']) {
            return 1;
          }
          if (a['type'] > b['type']) {
            return -1;
          }
          return 0;
        });
      }
    }
  }

  getSongKickTime(item) {
    let ans = '';
    if (item['start'] && item['start']['time']) {
      ans += item['start']['time'];
    }
    return ans;
  }

  letShowChange() {
    if (this.end === 5) {
      this.end = this.venueInfo['event'].length;
    } else {
      this.end = 5;
    }
  }

  checkCat() {
    if (this.event['classifications'] && this.event['classifications'][0]['segment']) {
      if (this.event['classifications'][0]['segment']['name'] && this.event['classifications'][0]['segment']['name'] === 'Music') {
        return true;
      }
    }
    return false;
  }
}

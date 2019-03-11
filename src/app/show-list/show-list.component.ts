import {Component, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {
  animation, trigger, animateChild, group,
  transition, animate, style, query, state
} from '@angular/animations';
import {NetworkService} from '../network.service';

@Component({
  selector: 'app-show-list',
  templateUrl: './show-list.component.html',
  styleUrls: ['./show-list.component.css'],
  animations: [
    trigger('showHideDetail', [
      // ...
      state('show', style({transform: 'translateX(0)'})),
      state('hide', style({})),
      transition('show => hide', [
        animate(300, style({transform: 'translateX(100%)'}))
      ]),
      transition('hide => show', [
        style({transform: 'translateX(-100%)'}),
        animate(300)
      ]),
    ]),
  ],
})
export class ShowListComponent implements OnInit, OnDestroy {
  @Input() results: any;
  @Input() storedEvents: any[] = [];
  @Input() selectedMainPanel: boolean;
  selectedItem: any;
  selectedItemUpcoming: any;
  selectedItemUpcomingAlias: any;
  shouldShowDetail = false;
  resetDetail: Function;
  googlePics: any;
  spotifyResults: any;

  constructor(renderer: Renderer2, private networkService: NetworkService) {
    // console.log('cons');
    this.resetDetail = renderer.listen(document.getElementById('submit'), 'click', (evt) => {
      this.selectedItem = undefined;
      this.shouldShowDetail = false;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.resetDetail();
  }


  showGenre(event) {
    let ans = '';
    if (event['classifications']) {
      if (event['classifications'][0]['genre'] !== undefined && event['classifications'][0]['genre']['name'] !== 'Undefined') {
        ans += event['classifications'][0]['genre']['name'];
        if (event['classifications'][0]['segment'] !== undefined && event['classifications'][0]['segment']['name'] !== 'Undefined') {
          ans += ' - ';
        }
      }
      if (event['classifications'][0]['segment'] !== undefined && event['classifications'][0]['segment']['name'] !== 'Undefined') {
        ans += event['classifications'][0]['segment']['name'];
      }
    }
    // console.log(ans);
    return ans;
  }

  showVenue(event) {
    let ans = '';
    if (event['_embedded'] && event['_embedded']['venues'] && event['_embedded']['venues'][0]['name']) {
      ans += event['_embedded']['venues'][0]['name'];
    }
    return ans;
  }

  shorten(eventString: string) {
    if (eventString.length <= 35) {
      return eventString;
    } else {
      let ans = eventString.substring(0, 35);
      if (ans[34] !== ' ') {
        for (let i = 33; i >= 0; i--) {
          if (ans[i] === ' ') {
            ans = ans.substring(0, i + 1);
            return ans + '...';
          }
        }
      }
      return ans + '...';
    }
  }

  showDetail(event) {
    this.selectedItem = event;
    this.getUpcoming(event);
    this.getGooglePics(event);
    this.getSpotifyResults(event);
    this.shouldShowDetail = true;
    console.log(event);
    return false;
  }

  getUpcoming(event) {
    if (this.showVenue(event) !== '') {
      this.selectedItemUpcoming = 'loading';
      this.networkService.reqUpcoming(this.showVenue(event)).subscribe(data => {
          // console.log(data);
          this.selectedItemUpcoming = data;
          this.selectedItemUpcomingAlias = JSON.parse(JSON.stringify(data));
        },
        err => {
          this.results = 'ERR';
          console.log(err);
        });
    }
  }

  getGooglePics(event) {
    this.googlePics = 'loading';
    const queue = [];
    if (event['_embedded'] && event['_embedded']['attractions']) {
      for (const s of event['_embedded']['attractions']) {
        queue.push(s.name);
      }
    }
    if (queue.length > 0) {
      this.networkService.reqGooglePics(queue).subscribe(data => {
          console.log(data);
          this.googlePics = data;
        },
        err => {
          this.results = 'ERR';
          console.log(err);
        });
    } else {
      this.googlePics = 'noResult';
    }
  }

  getSpotifyResults(event) {
    if (this.checkCat(event)) {
      const queue = [];
      if (event['_embedded'] && event['_embedded']['attractions']) {
        for (const s of event['_embedded']['attractions']) {
          queue.push(s.name);
        }
      }
      if (queue.length > 0) {
        this.spotifyResults = 'loading';
        this.networkService.reqSpotify(queue).subscribe(data => {
            console.log(data);
            this.spotifyResults = data;
          },
          err => {
            this.results = 'ERR';
            console.log(err);
          });
      } else {
        this.spotifyResults = 'noResult';
      }
    }
  }

  checkCat(event) {
    if (event['classifications'] && event['classifications'][0]['segment']) {
      if (event['classifications'][0]['segment']['name'] && event['classifications'][0]['segment']['name'] === 'Music') {
        return true;
      }
    }
    return false;
  }

  clickDetail() {
    this.shouldShowDetail = true;
    this.selectedItemUpcoming = JSON.parse(JSON.stringify(this.selectedItemUpcomingAlias));
    // this.storedInfo = this.results;
    // console.log(this.storedInfo, this.results);
  }

  checkStar(event) {
    if (this.storedEvents && event) {
      for (const x of this.storedEvents) {
        if (x['id'] === event['id']) {
          return true;
        }
      }
    }

    return false;
  }

  store(event) {
    this.storedEvents.push(event);
    localStorage.setItem('events', JSON.stringify(this.storedEvents));
    // TODO: save
  }

  forget(event) {
    // console.log(this.storedEvents.indexOf(event));
    this.storedEvents.splice(this.storedEvents.indexOf(event), 1);
    localStorage.setItem('events', JSON.stringify(this.storedEvents));
    // TODO: save
  }

  twitterText() {
    let str = 'Check out ' + this.selectedItem['name'];
    if (this.showVenue(this.selectedItem) !== '') {
      str += ' located at ' + this.showVenue(this.selectedItem);
    }
    str += '. Website: ' + this.selectedItem['url'] + ' #CSCI571 EventSearch';
    return encodeURIComponent(str);
  }

  getSeatUrl() {
    let ans = '';
    if (this.selectedItem['seatmap'] && this.selectedItem['seatmap']['staticUrl']) {
      ans = this.selectedItem['seatmap']['staticUrl'];
    }
    return ans;
  }
}

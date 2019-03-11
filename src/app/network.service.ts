import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {consoleTestResultHandler} from 'tslint/lib/test';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor(private http: HttpClient) {
  }

  getIpAPI(): Observable<any> {
    return this.http.get('http://ip-api.com/json');
  }

  sendForm(sendObject): Observable<any> {
    return this.http.get('http://localhost:3000/users/SearchEventTM', {params: sendObject});
  }

  reqAuto(keyword): Observable<any> {
    return this.http.get('http://localhost:3000/users/autoComplete?keyword=' + keyword);
    // return this.http.get('https://app.ticketmaster.com/discovery/v2/suggest?apikey=' + this.tm_api_key + '&keyword=' + keyword);
  }

  reqUpcoming(venueName): Observable<any> {
    return this.http.get('http://localhost:3000/users/reqUpcoming?venueName=' + venueName);
  }

  reqGooglePics(artists): Observable<any> {
    const param: any = {};
    param['artists'] = artists;
    // console.log(param);
    return this.http.get('http://localhost:3000/users/reqGooglePics' , {params: param});
  }

  reqSpotify(artists): Observable<any> {
    const param: any = {};
    param['artists'] = artists;
    // console.log(param);
    return this.http.get('http://localhost:3000/users/reqSpotify' , {params: param});
  }
}

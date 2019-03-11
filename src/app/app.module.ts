import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
// import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'; // <-- NgModel lives here
import {HttpClientModule} from '@angular/common/http';
import {ShowListComponent} from './show-list/show-list.component';
import {MatAutocompleteModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatTooltipModule} from '@angular/material';
import {DetailTabComponent} from './show-list/detail-tab/detail-tab.component';
import {AgmCoreModule} from '@agm/core';

@NgModule({
  declarations: [
    AppComponent,
    ShowListComponent,
    DetailTabComponent,
  ],
  imports: [
    BrowserModule,
    // AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    AgmCoreModule.forRoot({
      apiKey: 'API_KEY'
    })
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}


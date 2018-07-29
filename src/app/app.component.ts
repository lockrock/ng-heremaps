import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  currVal = {
    currLayer: 'map',
    currType: 'normal',
    currZoom: 10,
    currCenter: { lng: 13.4, lat: 52.51 }
  }
  
  layers = ['map', 'traffic', 'panorama'];
  types = ['normal', 'satellite', 'terrain'];

}

// /// <reference path="../../../../node_modules/@types/heremaps/index.d.ts" />

import { Component, 
  EventEmitter, 
  OnInit, 
  AfterViewInit, 
  Inject, 
  ViewChild, 
  Output,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
  SimpleChange,
} from '@angular/core';

import { MapConf } from './map.conf';
import { hereMapsEvents, HereMapsEvents, generateEventListeners } from './hereMapsEvents';
import { HereMapsServiceService, WayPoint } from './heremaps-service/here-maps-service.service';

@Component({
  selector: 'ng-heremaps',
  templateUrl: './ng-heremaps.component.html',
  styleUrls: ['./ng-heremaps.component.css']
})
export class NgHeremapsComponent implements AfterViewInit, OnDestroy, OnChanges {

  @Input() set mapType(newMapType: keyof H.service.DefaultLayers) {
    this._hereMapService.mapType = newMapType;
  }

  @Input() set mapLayer(newMapLayer: keyof H.service.MapType) {
    this._hereMapService.mapLayer = newMapLayer;
  }

  @Input() zoom = 1;
  @Output() zoomChange: EventEmitter<number> = new EventEmitter();
  
  @Input() center: H.geo.IPoint;
  @Output() centerChange = new EventEmitter<H.geo.IPoint>();

  @Input() routePointStart: WayPoint;
  @Input() routePointEnd: WayPoint;

  private _refreshMapBaseLayer() {
    this._hereMapService.refreshMapBaseLayer();
  }

  @Output() pointerdown: EventEmitter<any> = new EventEmitter();
  @Output() pointerup: EventEmitter<any> = new EventEmitter();
  @Output() pointermove: EventEmitter<any> = new EventEmitter();
  @Output() pointerenter: EventEmitter<any> = new EventEmitter();
  @Output() pointerleave: EventEmitter<any> = new EventEmitter();
  @Output() pointercancel: EventEmitter<any> = new EventEmitter();
  @Output() dragstart: EventEmitter<any> = new EventEmitter();
  @Output() drag: EventEmitter<any> = new EventEmitter();
  @Output() dragend: EventEmitter<any> = new EventEmitter();
  @Output() tap: EventEmitter<any> = new EventEmitter();
  @Output() dbltap: EventEmitter<any> = new EventEmitter();
  

  @ViewChild('hereMapsContainer') private mapContainer;

  constructor(
    @Inject('HereMapsConfig') private hereMapsConfig: MapConf, 
    private _hereMapService: HereMapsServiceService,
  ) {}

  ngAfterViewInit(): void {
    this._hereMapService.initMapsApi({
      mapEl: this.mapContainer.nativeElement,
      zoomListener: (newZoom) => {debugger; this.zoomChange.emit(newZoom);},
      centerListener: (newCenter) => {debugger; this.centerChange.emit(newCenter);}
    })    
  }

  ngOnDestroy() {
    this._hereMapService.dispose();
  }

  ngOnChanges(changes: SimpleChanges) {
    const isMapTypeChanged = changes.mapType 
      && changes.mapType.currentValue !== changes.mapType.previousValue 
      && !changes.mapType.firstChange;

    const isMapLayerChanged = changes.mapLayer 
      && changes.mapLayer.currentValue !== changes.mapLayer.previousValue 
      && !changes.mapLayer.firstChange;
      
    if(isMapTypeChanged || isMapLayerChanged) {
        this._refreshMapBaseLayer();
    }
    
    const zoom = changes.zoom;
    if(zoom 
      && zoom.currentValue !== zoom.previousValue) {
        this._hereMapService.zoom = zoom.currentValue;
    }

    const center = changes.center;
    if(center) this._onCenterChanges(center);

    const { routePointStart, routePointEnd } = changes;
    if(routePointStart &&
      routePointStart.currentValue !== routePointStart.previousValue) {
        this._hereMapService.routePointStart = routePointStart.currentValue;
    }

    if(routePointEnd &&
      routePointEnd.currentValue !== routePointEnd.previousValue) {
        this._hereMapService.routePointEnd = routePointEnd.currentValue;
    }

    if(routePointStart && routePointEnd) {
        this._hereMapService.calculateAndDisplayRoute();
      }
  }

  private _onCenterChanges(centerChanges: SimpleChange) {
    const newCenter = centerChanges.currentValue;    

    let needUpdate = false;
    
    for(const key of Object.keys(newCenter)) {
      needUpdate = needUpdate || 
                  centerChanges.firstChange || 
                  newCenter[key] !== centerChanges.previousValue[key];
    }    
    
    if(needUpdate) {
        this._hereMapService.center = newCenter;
    }
  }

}

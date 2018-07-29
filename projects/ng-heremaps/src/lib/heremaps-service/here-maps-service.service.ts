// /// <reference path="../../../../../node_modules/@types/heremaps/index.d.ts" />

import { Injectable, Inject } from '@angular/core';
import { IAssetsLoaderService, AssetsLoaderService, AssetType } from '../assets-loader/assets-loader.service';

import { MapConf } from '../map.conf';
import { generateEventListeners } from '../hereMapsEvents';

export type WayPoint = {x: number, y: number};

@Injectable({
  providedIn: 'root'
})
export class HereMapsServiceService {

  private _mapEl: any;
  private _baseURI = 'http://js.api.here.com/v3/3.0/';

  _zoom: number | null = null;
  set zoom(val: number) { 
    this._zoom = val;
    if(this._hereMap) this._hereMap.setZoom(val) 
  }
  get zoom() {
    return this._zoom;
  };

  _center: H.geo.Point | null = null;
  set center(val: H.geo.Point) { 
    this._center = val;
    if(this._hereMap) this._hereMap.setCenter(val) 
  }
  get center() {
    return this._center;
  }

  private _mapType: keyof H.service.DefaultLayers = 'satellite';
  private _mapLayer: keyof H.service.MapType = 'map';

  set mapType(newMapType: keyof H.service.DefaultLayers) {
    if(newMapType) this._mapType = newMapType;
  }

  set mapLayer(newMapLayer: keyof H.service.MapType) {
    if(newMapLayer) this._mapLayer = newMapLayer;
  }

  private _routePointStart: WayPoint;
  set routePointStart(val: WayPoint) { 
    this._routePointStart = val;
  };
  _routePointEnd: WayPoint;
  set routePointEnd(val: WayPoint) { 
    this._routePointEnd = val;
  };  

  private _hereMap: H.Map;
  private _mapRouter: H.service.RoutingService;
  private _mapPlatform: H.service.Platform;
  private _mapTypes?: H.service.DefaultLayers;
  private _baseLayer: H.map.layer.Layer;
  private _ui?: H.ui.UI;
  private _mapEvents?: H.mapevents.MapEvents;
  private _mapBehavior?: H.mapevents.Behavior;

  constructor(
    @Inject('HereMapsConfig') private hereMapsConfig: MapConf,
    @Inject(AssetsLoaderService) private assetsLoader: IAssetsLoaderService,
  ) {}

  async initMapsApi(opts: {
      mapEl: any, 
      zoomListener: (zoom: number) => void,
      centerListener: (center: H.geo.Point) => void,
    }) {
    this._mapEl = opts.mapEl;

    await this.assetsLoader.loadAsset(AssetType.script, this._convertResourceURI('mapsjs-core.js'));
    await this.assetsLoader.loadAsset(AssetType.script, this._convertResourceURI('mapsjs-service.js'));

    this.initMapPlatform();
    this.initMapTypes();
    this.initBaseLayer();
    this._initMap();
    this.initMapRoutingService();

    if(this.hereMapsConfig.useMapEvents) {
      await this.assetsLoader.loadAsset(AssetType.script, this._convertResourceURI('mapsjs-mapevents.js'));
      this.initMapEvents();
      this.initMapBehavior();
      this.initMapZoomListener(opts.zoomListener);
      this.initMapCenterListener(opts.centerListener);
    }

    if(this.hereMapsConfig.useMapUI) {
      await this.assetsLoader.loadAsset(AssetType.style, this._convertResourceURI('mapsjs-ui.css'));
      await this.assetsLoader.loadAsset(AssetType.script, this._convertResourceURI('mapsjs-ui.js'));
      this.initMapUI();
    }

  }

  dispose() {
    this._hereMap.dispose();
    this._baseLayer.dispose();
    this._mapBehavior.dispose();
  }

  private _convertResourceURI = (uri: string) => this._baseURI + uri;

  refreshMapBaseLayer() {
    this._hereMap.setBaseLayer(this._mapTypes[this._mapType][this._mapLayer]);
  }

  initMapPlatform() {
    this._mapPlatform = new H.service.Platform(this.hereMapsConfig.creds);
  }

  initMapTypes() {
    this._mapTypes = this._mapPlatform.createDefaultLayers();
  }

  initBaseLayer() {
    this._baseLayer = this._mapTypes[this._mapType][this._mapLayer];
  }

  _initMap() {
    const componentOpts = {} as any;
    if(this._zoom) componentOpts.zoom = this._zoom;
    if(this._center) componentOpts.center = this._center;
debugger;
    const options = {
      ...this.hereMapsConfig.mapOptions,
      ...componentOpts,
    };
    this._hereMap = new H.Map(
      this._mapEl,
      this._baseLayer,
      options
    );
  }

  initMapEvents() {
    this._mapEvents = new H.mapevents.MapEvents(this._hereMap);
    this._initMapPointerEventListeners();
  }

  initMapBehavior() {
    this._mapBehavior = new H.mapevents.Behavior(this._mapEvents);
  }

  initMapZoomListener(listener: (zoom: number) => void) {
    this._hereMap.addEventListener('mapviewchangeend', () => {
      const oldZoom = this.zoom;
      const newZoom = this._hereMap.getZoom();
      if (newZoom !== oldZoom) {
        listener(newZoom);
      }
    })
  }

  private initMapCenterListener(listener: (center: H.geo.Point) => void) {
    this._hereMap.addEventListener('mapviewchangeend', () => {
      debugger;
      const newCenter = this._hereMap.getCenter();
      const oldCenter = this._center;
      let isUpdated = false;
      if(oldCenter === null && newCenter !== null 
        || oldCenter !== null && newCenter === null) isUpdated = true; 
      if(!isUpdated) {
        for(const key of Object.keys(newCenter)) {
          isUpdated = isUpdated || newCenter[key] !== oldCenter[key];
        }
      }
      if (isUpdated) {
        this._center = newCenter;
        listener(newCenter);
      }
    })
  }

  private initMapUI() {
    this._ui = H.ui.UI.createDefault(this._hereMap, this._mapTypes);
  }

  private mapEventListeners = {};
  private _initMapPointerEventListeners() {
    const map = this._hereMap;
    const listenerInitiators = generateEventListeners(this, map);
    Object.keys(listenerInitiators).forEach(evName => {
      this.mapEventListeners[evName] = listenerInitiators[evName]();
    });
  }

  private initMapRoutingService() {
    this._mapRouter = this._mapPlatform.getRoutingService();
    this.calculateAndDisplayRoute();
  }

  private _createRoutingParams(start: WayPoint, end: WayPoint) {
    return {
      mode: 'fastest;car',
      waypoint0: `geo!${start.x},${start.y}`,
      waypoint1: `geo!${end.x},${end.y}`,
      representation: 'display'
    }
  }

  onMapRouteCalculated = (result) => {
    var route,
      routeShape,
      startPoint,
      endPoint,
      linestring;
    if(result.response.route) {
    // Pick the first route from the response:
    route = result.response.route[0];
    // Pick the route's shape:
    routeShape = route.shape;
  
    // Create a linestring to use as a point source for the route line
    linestring = new H.geo.LineString();
  
    // Push all the points in the shape into the linestring:
    routeShape.forEach(function(point) {
      var parts = point.split(',');
      linestring.pushLatLngAlt(parts[0], parts[1]);
    });
  
    // Retrieve the mapped positions of the requested waypoints:
    startPoint = route.waypoint[0].mappedPosition;
    endPoint = route.waypoint[1].mappedPosition;
  
    // Create a polyline to display the route:
    var routeLine = new H.map.Polyline(linestring, {
      style: { strokeColor: 'blue', lineWidth: 10 }
    });
  
    // Create a marker for the start point:
    var startMarker = new H.map.Marker({
      lat: startPoint.latitude,
      lng: startPoint.longitude
    });
  
    // Create a marker for the end point:
    var endMarker = new H.map.Marker({
      lat: endPoint.latitude,
      lng: endPoint.longitude
    });
  
    // Add the route polyline and the two markers to the map:
    this._hereMap.addObjects([routeLine, startMarker, endMarker]);
  
    // Set the map's viewport to make the whole route visible:
    this._hereMap.setViewBounds(routeLine.getBounds());
    }
  };

  calculateAndDisplayRoute() {debugger;
    if(!this._routePointStart || !this._routePointEnd) return;
    const routeParams = this._createRoutingParams(this._routePointStart, this._routePointEnd);
    if(this._mapRouter) 
    {
      this._mapRouter.calculateRoute(
        routeParams,
        this.onMapRouteCalculated,
        (err) => {console.log(err)})
    }
  }
}

import { Injectable, Inject } from '@angular/core';

// export const ASSET_TYPES = Object.freeze({
//   style: 'style' as 'style',
//   script: 'script' as 'script',
// });

export enum AssetType {
  script = 'script',
  style = 'style',
}

// export type AssetType = keyof typeof ASSET_TYPES

export interface IAssetsLoaderService {
  loadAsset(assetType: AssetType, src: string): Promise<void>
}

@Injectable({
  providedIn: 'root'
})
export class AssetsLoaderService implements IAssetsLoaderService {

  constructor(
    @Inject('Document1') private document
  ) { }

  private createHtmlElement(assetType: AssetType, src: string) {
    let tagName: string;
    let type: string;
    let srcAttr: string;
    let attrs = {} as any;
    switch(assetType) {
      case 'script': 
        tagName = 'script';
        attrs.type = 'text/javascript';
        attrs.src = src;
        break;
      case 'style':
        tagName = 'link';
        attrs.type = 'text/css';
        attrs.href = src;
        attrs.rel = 'stylesheet';       
        break;
      default: throw new Error(`Unknown assetType: ${assetType}`);
    }
    const el: HTMLElement = this.document.createElement(tagName);
    for(let attr in attrs) {
      el.setAttribute(attr, attrs[attr]);
    }
    return el;
  }

  private listenToAssetTag(assetTag) {
    return new Promise<void>((res, rej) => {
      assetTag.addEventListener('load', () => res());
      assetTag.addEventListener('error', () => rej('Loading of resource failed'));
    });
  }

  loadAsset(assetType: AssetType, src: string): Promise<void> {
    let el = this.document.getElementById(src);
    if(el) return Promise.reject('Already loaded');
    el = this.createHtmlElement(assetType, src)
    document.getElementsByTagName('head')[0].appendChild(el);
    return this.listenToAssetTag(el);
  }
}

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgHeremapsComponent } from './ng-heremaps.component';
import { IAssetsLoaderService, AssetsLoaderService, AssetType } from './assets-loader/assets-loader.service';

class MockAssetsLoader implements IAssetsLoaderService {
  private document: Document
  assetsToLoad = []
  loadAsset(assetType: AssetType, src: string): Promise<void> {
    return Promise.resolve();
  }
}

describe('NgHeremapsComponent', () => {
  let component: NgHeremapsComponent;
  let fixture: ComponentFixture<NgHeremapsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgHeremapsComponent ],
      providers: [
        { provide: 'HereMapsConfig', useValue: { app_id: 'some-app-id',  app_code: 'some-app-code' } },
        { provide: AssetsLoaderService, useValue: MockAssetsLoader }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgHeremapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should ')
});

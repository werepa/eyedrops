import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleriaFotosComponent } from './galeria-fotos.component';

describe('GaleriaFotosComponent', () => {
  let component: GaleriaFotosComponent;
  let fixture: ComponentFixture<GaleriaFotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaleriaFotosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GaleriaFotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

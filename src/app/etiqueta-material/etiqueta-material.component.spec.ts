import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtiquetaMaterialComponent } from './etiqueta-material.component';

describe('EtiquetaMaterialComponent', () => {
  let component: EtiquetaMaterialComponent;
  let fixture: ComponentFixture<EtiquetaMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtiquetaMaterialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtiquetaMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

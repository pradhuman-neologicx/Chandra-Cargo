import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDocumentComponent } from './vehicle-document.component';

describe('VehicleDocumentComponent', () => {
  let component: VehicleDocumentComponent;
  let fixture: ComponentFixture<VehicleDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VehicleDocumentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleMappingComponent } from './vehicle-mapping.component';

describe('VehicleMappingComponent', () => {
  let component: VehicleMappingComponent;
  let fixture: ComponentFixture<VehicleMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VehicleMappingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpAttendenceComponent } from './emp-attendence.component';

describe('EmpAttendenceComponent', () => {
  let component: EmpAttendenceComponent;
  let fixture: ComponentFixture<EmpAttendenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmpAttendenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpAttendenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

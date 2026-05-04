import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendancePayrollComponent } from './attendance-payroll.component';

describe('AttendancePayrollComponent', () => {
  let component: AttendancePayrollComponent;
  let fixture: ComponentFixture<AttendancePayrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttendancePayrollComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendancePayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

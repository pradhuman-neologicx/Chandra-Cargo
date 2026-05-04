import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollGeneratorComponent } from './payroll-generator.component';

describe('PayrollGeneratorComponent', () => {
  let component: PayrollGeneratorComponent;
  let fixture: ComponentFixture<PayrollGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayrollGeneratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

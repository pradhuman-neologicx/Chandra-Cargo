import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryListingComponent } from './salary-listing.component';

describe('SalaryListingComponent', () => {
  let component: SalaryListingComponent;
  let fixture: ComponentFixture<SalaryListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalaryListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

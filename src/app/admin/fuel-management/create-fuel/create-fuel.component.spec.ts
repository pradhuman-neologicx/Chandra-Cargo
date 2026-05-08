import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFuelComponent } from './create-fuel.component';

describe('CreateFuelComponent', () => {
  let component: CreateFuelComponent;
  let fixture: ComponentFixture<CreateFuelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateFuelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

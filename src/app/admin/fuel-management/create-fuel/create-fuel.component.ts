import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { animate, style, transition, trigger } from '@angular/animations';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  selector: 'app-create-fuel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgSelectModule, RouterModule],
  templateUrl: './create-fuel.component.html',
  styleUrl: './create-fuel.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class CreateFuelComponent implements OnInit {
  fuelForm!: FormGroup;
  
  // Mock Data
  vehicles = [
    { id: 1, regNo: 'RJ-14-GA-1234', model: 'Tata LPT 1613' },
    { id: 2, regNo: 'DL-01-BK-5678', model: 'Mahindra Bolero' },
    { id: 3, regNo: 'MH-04-ET-9012', model: 'Ashok Leyland Dost' },
    { id: 4, regNo: 'UP-32-JN-3456', model: 'Eicher Pro 3015' },
    { id: 5, regNo: 'HR-55-CD-7890', model: 'BharatBenz 2823R' },
    { id: 6, regNo: 'GJ-05-XY-1122', model: 'Tata Ace' },
  ];
  drivers = [
    'Rajesh Kumar', 
    'Suresh Singh', 
    'Amit Sharma', 
    'Mahendra Yadav', 
    'Vikram Rathore', 
    'Deepak Verma',
    'Sunil Meena'
  ];
  fuelTypes = ['Diesel', 'Petrol', 'CNG'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.fuelForm = this.fb.group({
      vehicleId: ['', Validators.required],
      station: [''],
      driver: ['', Validators.required],
      fuelType: ['Diesel', Validators.required],
      qty: ['', [Validators.required, Validators.min(0.1)]],
      amount: ['', [Validators.required, Validators.min(1)]],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      odometer: ['', Validators.required],
    });
  }

  goBack() {
    this.router.navigate(['/admin/fuel-management']);
  }

  saveEntry() {
    if (this.fuelForm.valid) {
      const formData = this.fuelForm.value;
      const selectedVehicle = this.vehicles.find(v => v.id == formData.vehicleId);
      
      // Preparing the final data object
      const newEntry = {
        vehicleReg: selectedVehicle?.regNo || 'Unknown',
        ...formData,
        type: formData.fuelType, // map fuelType to type
        mileage: (Math.random() * 5 + 10).toFixed(2)
      };

      console.log('Saving New Entry:', newEntry);
      this.notificationService.show('Fuel entry saved successfully', 'success', 3000);
      this.goBack();
    } else {
      this.notificationService.show('Please fill all required fields', 'error', 3000);
    }
  }
}

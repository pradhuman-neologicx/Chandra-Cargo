import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { animate, style, transition, trigger } from '@angular/animations';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  selector: 'app-edit-fuel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgSelectModule, RouterModule],
  templateUrl: './edit-fuel.component.html',
  styleUrl: './edit-fuel.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class EditFuelComponent implements OnInit {
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
  
  fuelEntries = [
    { 
      id: 1, 
      vehicleReg: 'RJ-14-GA-1234', 
      station: 'HP Petrol Pump - Highway', 
      driver: 'Rajesh Kumar', 
      type: 'Diesel', 
      qty: 50.5, 
      amount: 4500, 
      date: '2026-05-01',
      odometer: 45200,
      mileage: 12.5
    },
    { 
      id: 2, 
      vehicleReg: 'DL-01-BK-5678', 
      station: 'Bharat Petroleum - City Center', 
      driver: 'Suresh Singh', 
      type: 'Diesel', 
      qty: 40.0, 
      amount: 3600, 
      date: '2026-05-03',
      odometer: 12800,
      mileage: 14.2
    }
  ];

  entry: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : null;

    if (id !== null) {
      this.entry = this.fuelEntries.find(e => e.id === id);
    }
    
    if (!this.entry) {
      this.notificationService.show('Entry not found', 'error', 3000);
      this.goBack();
      return;
    }

    this.initForm();
    this.patchForm();
  }

  initForm() {
    this.fuelForm = this.fb.group({
      vehicleId: ['', Validators.required],
      station: [''],
      driver: ['', Validators.required],
      fuelType: ['Diesel', Validators.required],
      qty: ['', [Validators.required, Validators.min(0.1)]],
      amount: ['', [Validators.required, Validators.min(1)]],
      date: ['', Validators.required],
      odometer: ['', Validators.required],
    });
  }

  patchForm() {
    const vehicle = this.vehicles.find(v => v.regNo === this.entry.vehicleReg);
    this.fuelForm.patchValue({
      vehicleId: vehicle?.id || '',
      station: this.entry.station,
      driver: this.entry.driver,
      fuelType: this.entry.type,
      qty: this.entry.qty,
      amount: this.entry.amount,
      date: this.entry.date,
      odometer: this.entry.odometer
    });
  }

  goBack() {
    this.router.navigate(['/admin/fuel-management']);
  }

  saveEntry() {
    if (this.fuelForm.valid) {
      const formData = this.fuelForm.value;
      const selectedVehicle = this.vehicles.find(v => v.id == formData.vehicleId);
      
      // Preparing the updated data object
      const updatedEntry = {
        ...this.entry,
        ...formData,
        vehicleReg: selectedVehicle?.regNo || 'Unknown',
        type: formData.fuelType // map fuelType to type
      };

      console.log('Updating Entry:', updatedEntry);
      this.notificationService.show('Fuel entry updated successfully', 'success', 3000);
      this.goBack();
    } else {
      this.notificationService.show('Please fill all required fields', 'error', 3000);
    }
  }
}

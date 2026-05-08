import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/mat/mat.module';
import { animate, style, transition, trigger } from '@angular/animations';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-fuel-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxPaginationModule, MaterialModule, NgSelectModule, RouterModule],
  templateUrl: './fuel-management.component.html',
  styleUrl: './fuel-management.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class FuelManagementComponent implements OnInit {
  // Mock Data
  vehicles = [
    { id: 1, regNo: 'RJ-14-GA-1234', model: 'Tata LPT 1613' },
    { id: 2, regNo: 'DL-01-BK-5678', model: 'Mahindra Bolero' },
    { id: 3, regNo: 'MH-04-ET-9012', model: 'Ashok Leyland Dost' },
    { id: 4, regNo: 'UP-32-JN-3456', model: 'Eicher Pro 3015' },
    { id: 5, regNo: 'HR-55-CD-7890', model: 'BharatBenz 2823R' },
    { id: 6, regNo: 'GJ-05-XY-1122', model: 'Tata Ace' },
  ];
  fuelStations = ['Bharat Petroleum - City Center', 'HP Petrol Pump - Highway', 'Reliance Fuel - North Hub'];
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
      mileage: 12.5 // km/l
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


  // Table State
  page: number = 1;
  tableSize: number = 10;
  searchQuery: string = '';

  // Modal State - No longer needed here as logic moved to components
  // isModalOpen: boolean = false;
  // isEdit: boolean = false;
  // selectedId: any = null;
  // fuelForm!: FormGroup;

  constructor(private notificationService: NotificationService, private router: Router) {}

  ngOnInit(): void {
    // this.initForm(); // Moved to components
  }

  /* Moved to components
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
  */

  openAddPage() {
    this.router.navigate(['/admin/fuel-management/create']);
  }

  viewDetails(entry: any) {
    this.router.navigate(['/admin/fuel-management/details', entry.id]);
  }

  openEditPage(entry: any) {
    this.router.navigate(['/admin/fuel-management/edit', entry.id]);
  }


  // Search Logic
  get filteredEntries() {
    return this.fuelEntries.filter(e => 
      e.vehicleReg.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      e.station.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      e.driver.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onTableDataChange(event: any) {
    this.page = event;
  }
}

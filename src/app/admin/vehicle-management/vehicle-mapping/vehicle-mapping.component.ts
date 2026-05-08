import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/mat/mat.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-vehicle-mapping',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './vehicle-mapping.component.html',
  styleUrl: './vehicle-mapping.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class VehicleMappingComponent implements OnInit {
  mappingForm!: FormGroup;
  
  // Mock Data
  unmappedVehicles = [
    { id: 'V1', regNo: 'NL-01-RA-4789', model: 'Tata LPT 1613' },
    { id: 'V2', regNo: 'NL-01-RB-5521', model: 'Mahindra Blazo' },
    { id: 'V3', regNo: 'NL-01-RC-1002', model: 'Ashok Leyland 2823' }
  ];

  drivers = [
    { id: 'D1', name: 'Rajesh Kumar', license: 'DL-4552021', mobile: '9876543210' },
    { id: 'D2', name: 'Suresh Singh', license: 'DL-9988112', mobile: '8877665544' },
    { id: 'D3', name: 'Amit Sharma', license: 'DL-1122334', mobile: '7766554433' }
  ];

  recentMappings = [
    { vehicle: 'NL-01-RA-1122', driver: 'Vikram Singh', date: '2023-10-25', status: 'Active' },
    { vehicle: 'NL-01-RB-9988', driver: 'Mohit Yadav', date: '2023-10-24', status: 'Active' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.mappingForm = this.fb.group({
      vehicleId: [null, Validators.required],
      driverId: [null, Validators.required],
      assignmentDate: [new Date().toISOString().split('T')[0]],
      shift: ['Full Day']
    });
  }

  submitMapping() {
    if (this.mappingForm.valid) {
      const formVal = this.mappingForm.value;
      const vehicle = this.unmappedVehicles.find(v => v.id === formVal.vehicleId);
      const driver = this.drivers.find(d => d.id === formVal.driverId);
      
      // Simulate saving
      this.notificationService.show(`Success: ${vehicle?.regNo} mapped to ${driver?.name}`, 'success', 3000);
      
      // Update local list for UI feedback
      this.recentMappings.unshift({
        vehicle: vehicle?.regNo || '',
        driver: driver?.name || '',
        date: formVal.assignmentDate,
        status: 'Active'
      });
      
      this.mappingForm.reset({
        assignmentDate: new Date().toISOString().split('T')[0],
        shift: 'Full Day'
      });
    } else {
      this.notificationService.show('Please select both Vehicle and Driver', 'error', 3000);
    }
  }

  goBack() {
    this.router.navigate(['/admin/vehicle-management']);
  }
}

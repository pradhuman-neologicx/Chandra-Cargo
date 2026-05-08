import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/mat/mat.module';
import {
  animate,
  style,
  transition,
  trigger,
  state,
} from '@angular/animations';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-vehicle-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MaterialModule,
    NgSelectModule,
  ],
  templateUrl: './vehicle-management.component.html',
  styleUrl: './vehicle-management.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
    trigger('drawerAnimation', [
      state('closed', style({ transform: 'translateX(100%)' })),
      state('open', style({ transform: 'translateX(0)' })),
      transition(
        'closed <=> open',
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)'),
      ),
    ]),
  ],
})
export class VehicleManagementComponent implements OnInit {
  // Drawer & Tabs State
  isDrawerOpen = false;
  activeStatsTab = 'docs';

  // Pagination & Search
  page: number = 1;
  tableSize: any = 10;
  tableSizes: any = [10, 20, 50, 100, 'all'];
  totalRecords: number = 0;
  searchQuery: string = '';

  // Vehicle Table Data
  vehicles: any[] = [
    {
      id: 1,
      regNo: 'RJ-14-GA-1234',
      manufacturer: 'Tata Motors',
      model: 'LPT 1613',
      type: 'Truck',
      status: 'Active',
    },
    {
      id: 2,
      regNo: 'MH-01-AX-9988',
      manufacturer: 'Mahindra',
      model: 'Blazo X',
      type: 'Truck',
      status: 'Draft',
    },
    {
      id: 3,
      regNo: 'DL-01-CV-4455',
      manufacturer: 'Ashok Leyland',
      model: 'Dost',
      type: 'Mini Truck',
      status: 'Active',
    },
    {
      id: 4,
      regNo: 'HR-55-BT-1122',
      manufacturer: 'BharatBenz',
      model: '2823R',
      type: 'Heavy Truck',
      status: 'Inactive',
    },
    {
      id: 5,
      regNo: 'UP-32-JN-7766',
      manufacturer: 'Eicher',
      model: 'Pro 3015',
      type: 'Truck',
      status: 'Active',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.totalRecords = this.vehicles.length;
  }

  // Drawer Actions
  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
  }

  // Action Menu Handlers
  openAddVehicle() {
    this.closeDrawer();
    this.router.navigate(['/admin/vehicle-management/create']);
  }

  openBulkUpload() {
    this.closeDrawer();
    this.router.navigate(['/admin/vehicle-management/bulk-upload']);
  }

  openEditVehicle(vehicle: any) {
    this.router.navigate(['/admin/vehicle-management/edit', vehicle.id]);
  }

  openMapping() {
    this.router.navigate(['/admin/vehicle-management/mapping']);
  }

  openViewDetail(v: any) {
    this.router.navigate(['/admin/vehicle-management/view', v.id]);
  }

  openUpdateDocs(v: any) {
    this.router.navigate(['/admin/vehicle-management/update-docs', v.id]);
  }

  goToMaintenance(v: any) {
    this.router.navigate(['/admin/vehicle-maintenance', v.id]);
  }

  // Pagination & Search
  onTableDataChange(event: any) {
    this.page = event;
  }

  searchVehicles() {
    console.log('Searching for:', this.searchQuery);
    // Implement search logic if needed
  }
}

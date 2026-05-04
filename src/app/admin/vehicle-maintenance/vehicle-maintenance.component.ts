import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/mat/mat.module';
import { animate, style, transition, trigger } from '@angular/animations';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vehicle-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxPaginationModule, MaterialModule],
  templateUrl: './vehicle-maintenance.component.html',
  styleUrl: './vehicle-maintenance.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class VehicleMaintenanceComponent implements OnInit {
  // Vehicle Selection
  vehicleList = [
    { id: 1, regNo: 'RJ-14-GA-1234', manufacturer: 'Tata Motors', model: 'LPT 1613' },
    { id: 2, regNo: 'DL-01-BK-5678', manufacturer: 'Mahindra', model: 'Bolero' },
    { id: 3, regNo: 'MH-04-ET-9012', manufacturer: 'Ashok Leyland', model: 'Dost' },
  ];
  selectedVehicleId: any = 1;
  selectedVehicle: any;

  // Maintenance Data (Mock)
  maintenanceHistory: any[] = [
    {
      id: 1,
      type: 'Oil Change',
      date: '2026-04-15',
      cost: 4500,
      vendor: 'Tata Service Center',
      km: 45200,
      nextDue: '2026-10-15',
      nextDueKm: 50200
    },
    {
      id: 2,
      type: 'Tyre Change',
      date: '2026-03-10',
      cost: 12000,
      vendor: 'CEAT Shoppe',
      km: 42000,
      nextDue: '2027-03-10',
      nextDueKm: 80000
    }
  ];

  // Stats
  totalCost: number = 0;
  lastServiceDate: string = '';
  nextServiceDate: string = '';

  // Modals
  serviceModalOpen: boolean = false;
  isEdit: boolean = false;
  selectedRecordId: any = null;
  serviceForm!: FormGroup;

  // Tabs
  activeTab: string = 'history'; // 'history' or 'alerts'

  constructor(private fb: FormBuilder, private notificationService: NotificationService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.selectedVehicleId = params['id'];
        this.updateSelectedVehicle();
      }
    });
    this.initForm();
    this.calculateStats();
  }

  updateSelectedVehicle() {
    this.selectedVehicle = this.vehicleList.find(v => v.id == this.selectedVehicleId);
    this.calculateStats();
  }

  calculateStats() {
    this.totalCost = this.maintenanceHistory.reduce((acc, curr) => acc + curr.cost, 0);
    if (this.maintenanceHistory.length > 0) {
      const sorted = [...this.maintenanceHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.lastServiceDate = sorted[0].date;
      this.nextServiceDate = sorted[0].nextDue;
    }
  }

  initForm() {
    this.serviceForm = this.fb.group({
      type: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      cost: ['', [Validators.required, Validators.min(0)]],
      vendor: ['', Validators.required],
      km: ['', Validators.required],
      nextDue: ['', Validators.required],
      nextDueKm: ['']
    });
  }

  openServiceModal() {
    this.isEdit = false;
    this.selectedRecordId = null;
    this.initForm();
    this.serviceModalOpen = true;
  }

  editServiceRecord(record: any) {
    this.isEdit = true;
    this.selectedRecordId = record.id;
    this.serviceForm.patchValue({
      type: record.type,
      date: record.date,
      cost: record.cost,
      vendor: record.vendor,
      km: record.km,
      nextDue: record.nextDue,
      nextDueKm: record.nextDueKm
    });
    this.serviceModalOpen = true;
  }

  closeModal() {
    this.serviceModalOpen = false;
  }

  saveServiceRecord() {
    if (this.serviceForm.valid) {
      if (this.isEdit) {
        const index = this.maintenanceHistory.findIndex(r => r.id === this.selectedRecordId);
        if (index > -1) {
          this.maintenanceHistory[index] = { ...this.maintenanceHistory[index], ...this.serviceForm.value };
        }
      } else {
        const record = {
          id: this.maintenanceHistory.length + 1,
          ...this.serviceForm.value
        };
        this.maintenanceHistory.unshift(record);
      }
      this.calculateStats();
      this.notificationService.show(this.isEdit ? 'Service record updated' : 'Service record added', 'success', 3000);
      this.closeModal();
    } else {
      this.notificationService.show('Please fill all required fields', 'error', 3000);
    }
  }

  getServiceTypes() {
    return ['Engine Repair', 'Tyre Change', 'Oil Change', 'General Repair', 'Brake Service', 'Battery Replacement'];
  }
}

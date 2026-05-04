import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/mat/mat.module';
import { animate, style, transition, trigger } from '@angular/animations';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  selector: 'app-vehicle-model',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxPaginationModule, MaterialModule],
  templateUrl: './vehicle-model.component.html',
  styleUrl: './vehicle-model.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class VehicleModelComponent implements OnInit {
  // Pagination
  page: number = 1;
  tableSize: any = 10;
  tableSizes: any = [10, 20, 50, 100, 'all'];
  totalRecords: number = 0;

  // Search
  searchbarform!: FormGroup;
  showreset: boolean = false;

  // Static Data
  manufacturerList = [
    { id: 1, name: 'Tata Motors' },
    { id: 2, name: 'Mahindra & Mahindra' },
    { id: 3, name: 'Ashok Leyland' },
    { id: 4, name: 'BharatBenz' },
    { id: 5, name: 'Eicher Motors' },
  ];

  vehicleTypes = ['Bus', 'Truck', 'Van', 'Mini Truck'];

  modelList: any[] = [
    { id: 1, manufacturerId: 1, manufacturerName: 'Tata Motors', name: 'LPT 1613', type: 'Truck', is_active: 1 },
    { id: 2, manufacturerId: 1, manufacturerName: 'Tata Motors', name: 'Starbus', type: 'Bus', is_active: 1 },
    { id: 3, manufacturerId: 3, manufacturerName: 'Ashok Leyland', name: 'Dost', type: 'Mini Truck', is_active: 1 },
    { id: 4, manufacturerId: 5, manufacturerName: 'Eicher Motors', name: 'Pro 2049', type: 'Truck', is_active: 1 },
  ];

  table_heading = [
    { heading0: 'Sr No.', heading1: 'Manufacturer', heading2: 'Model Name', heading3: 'Vehicle Type', heading4: 'Status', heading5: 'Actions' }
  ];

  // Modals
  createModalOpen: boolean = false;
  updateModalOpen: boolean = false;
  viewModalOpen: boolean = false;

  // Forms
  createForm!: FormGroup;
  updateForm!: FormGroup;
  viewForm!: FormGroup;

  selectedModel: any;

  constructor(private fb: FormBuilder, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.searchbarform = this.fb.group({
      searchbar: ['', Validators.required],
    });

    this.initForms();
    this.totalRecords = this.modelList.length;
  }

  initForms() {
    this.createForm = this.fb.group({
      ManufacturerId: ['', Validators.required],
      Name: ['', Validators.required],
      VehicleType: ['', Validators.required],
    });

    this.updateForm = this.fb.group({
      ManufacturerId: ['', Validators.required],
      Name: ['', Validators.required],
      VehicleType: ['', Validators.required],
    });

    this.viewForm = this.fb.group({
      ManufacturerId: [{ value: '', disabled: true }],
      Name: [{ value: '', disabled: true }],
      VehicleType: [{ value: '', disabled: true }],
    });
  }

  // Pagination & Table Size
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  // Search
  searchfun() {
    if (this.searchbarform.valid) {
      this.showreset = true;
    }
  }

  resetsearchbar() {
    this.searchbarform.reset();
    this.showreset = false;
  }

  // Modal Actions
  openAddModal() {
    this.createForm.reset();
    this.createModalOpen = true;
  }

  openEditModal(data: any) {
    this.selectedModel = data;
    this.updateForm.patchValue({
      ManufacturerId: data.manufacturerId,
      Name: data.name,
      VehicleType: data.type
    });
    this.updateModalOpen = true;
  }

  openViewModal(data: any) {
    this.viewForm.patchValue({
      ManufacturerId: data.manufacturerId,
      Name: data.name,
      VehicleType: data.type
    });
    this.viewModalOpen = true;
  }

  closeModal() {
    this.createModalOpen = false;
    this.updateModalOpen = false;
    this.viewModalOpen = false;
  }

  // CRUD Actions
  createModel() {
    if (this.createForm.valid) {
      const mId = this.createForm.value.ManufacturerId;
      const manufacturer = this.manufacturerList.find(m => m.id == mId);
      
      const newModel = {
        id: this.modelList.length + 1,
        manufacturerId: mId,
        manufacturerName: manufacturer ? manufacturer.name : 'Unknown',
        name: this.createForm.value.Name,
        type: this.createForm.value.VehicleType,
        is_active: 1
      };
      
      this.modelList.unshift(newModel);
      this.totalRecords = this.modelList.length;
      this.notificationService.show('Vehicle Model added successfully', 'success', 3000);
      this.closeModal();
    }
  }

  updateModel() {
    if (this.updateForm.valid) {
      const index = this.modelList.findIndex(m => m.id === this.selectedModel.id);
      if (index !== -1) {
        const mId = this.updateForm.value.ManufacturerId;
        const manufacturer = this.manufacturerList.find(m => m.id == mId);
        
        this.modelList[index].manufacturerId = mId;
        this.modelList[index].manufacturerName = manufacturer ? manufacturer.name : 'Unknown';
        this.modelList[index].name = this.updateForm.value.Name;
        this.modelList[index].type = this.updateForm.value.VehicleType;
        
        this.notificationService.show('Vehicle Model updated successfully', 'success', 3000);
        this.closeModal();
      }
    }
  }

  toggleStatus(id: number, status: number) {
    const index = this.modelList.findIndex(m => m.id === id);
    if (index !== -1) {
      this.modelList[index].is_active = status;
      const msg = status === 1 ? 'Model activated' : 'Model deactivated';
      this.notificationService.show(msg, 'success', 3000);
    }
  }
}

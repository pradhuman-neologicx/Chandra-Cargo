import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/mat/mat.module';
import { animate, style, transition, trigger } from '@angular/animations';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  selector: 'app-vehicle-manufacturer',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxPaginationModule, MaterialModule],
  templateUrl: './vehicle-manufacturer.component.html',
  styleUrl: './vehicle-manufacturer.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class VehicleManufacturerComponent implements OnInit {
  // Pagination
  page: number = 1;
  tableSize: any = 10;
  tableSizes: any = [10, 20, 50, 100, 'all'];
  totalRecords: number = 0;

  // Search
  searchbarform!: FormGroup;
  showreset: boolean = false;

  // Data
  manufacturerList: any[] = [
    { id: 1, name: 'Tata Motors', is_active: 1 },
    { id: 2, name: 'Mahindra & Mahindra', is_active: 1 },
    { id: 3, name: 'Ashok Leyland', is_active: 1 },
    { id: 4, name: 'BharatBenz', is_active: 1 },
    { id: 5, name: 'Eicher Motors', is_active: 1 },
  ];

  table_heading = [
    { heading0: 'Sr No.', heading1: 'Manufacturer Name', heading2: 'Status', heading3: 'Actions' }
  ];

  // Modals
  createModalOpen: boolean = false;
  updateModalOpen: boolean = false;
  viewModalOpen: boolean = false;

  // Forms
  createForm!: FormGroup;
  updateForm!: FormGroup;
  viewForm!: FormGroup;

  selectedManufacturer: any;

  constructor(private fb: FormBuilder, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.searchbarform = this.fb.group({
      searchbar: ['', Validators.required],
    });

    this.initForms();
    this.totalRecords = this.manufacturerList.length;
  }

  initForms() {
    this.createForm = this.fb.group({
      Name: ['', Validators.required],
    });

    this.updateForm = this.fb.group({
      Name: ['', Validators.required],
    });

    this.viewForm = this.fb.group({
      Name: [{ value: '', disabled: true }],
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
      // Implement filtering logic here
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
    this.selectedManufacturer = data;
    this.updateForm.patchValue({ Name: data.name });
    this.updateModalOpen = true;
  }

  openViewModal(data: any) {
    this.viewForm.patchValue({ Name: data.name });
    this.viewModalOpen = true;
  }

  closeModal() {
    this.createModalOpen = false;
    this.updateModalOpen = false;
    this.viewModalOpen = false;
  }

  // CRUD Actions
  createManufacturer() {
    if (this.createForm.valid) {
      const newManufacturer = {
        id: this.manufacturerList.length + 1,
        name: this.createForm.value.Name,
        is_active: 1
      };
      this.manufacturerList.unshift(newManufacturer);
      this.totalRecords = this.manufacturerList.length;
      this.notificationService.show('Manufacturer added successfully', 'success', 3000);
      this.closeModal();
    }
  }

  updateManufacturer() {
    if (this.updateForm.valid) {
      const index = this.manufacturerList.findIndex(m => m.id === this.selectedManufacturer.id);
      if (index !== -1) {
        this.manufacturerList[index].name = this.updateForm.value.Name;
        this.notificationService.show('Manufacturer updated successfully', 'success', 3000);
        this.closeModal();
      }
    }
  }

  toggleStatus(id: number, status: number) {
    const index = this.manufacturerList.findIndex(m => m.id === id);
    if (index !== -1) {
      this.manufacturerList[index].is_active = status;
      const msg = status === 1 ? 'Manufacturer activated' : 'Manufacturer deactivated';
      this.notificationService.show(msg, 'success', 3000);
    }
  }
}

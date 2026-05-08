import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/mat/mat.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { animate, style, transition, trigger } from '@angular/animations';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  selector: 'app-vehicle-type',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxPaginationModule, MaterialModule, MatTooltipModule],
  templateUrl: './vehicle-type.component.html',
  styleUrl: './vehicle-type.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class VehicleTypeComponent implements OnInit {
  // Mock Data
  vehicleTypes = [
    { id: 1, name: 'Bus', description: 'Passenger transport vehicles', status: 'Active' },
    { id: 2, name: 'Truck', description: 'Heavy goods transport', status: 'Active' },
    { id: 3, name: 'Trailer', description: 'Articulated transport', status: 'Active' },
    { id: 4, name: 'Tanker', description: 'Liquid/Gas transport', status: 'Inactive' },
    { id: 5, name: 'Pickup', description: 'Light commercial vehicle', status: 'Active' },
    { id: 6, name: 'Car', description: 'Small passenger vehicle', status: 'Active' },
  ];

  // Table State
  page: number = 1;
  tableSize: number = 10;
  totalRecords: number = 0;
  searchQuery: string = '';

  // Modal State
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  selectedId: any = null;
  typeForm!: FormGroup;

  constructor(private fb: FormBuilder, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.totalRecords = this.vehicleTypes.length;
    this.initForm();
  }

  initForm() {
    this.typeForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      status: ['Active', Validators.required],
    });
  }

  // CRUD Actions
  openAddModal() {
    this.isEditMode = false;
    this.selectedId = null;
    this.typeForm.reset({ status: 'Active' });
    this.isModalOpen = true;
  }

  openEditModal(item: any) {
    this.isEditMode = true;
    this.selectedId = item.id;
    this.typeForm.patchValue({
      name: item.name,
      description: item.description,
      status: item.status,
    });
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveType() {
    if (this.typeForm.valid) {
      if (this.isEditMode) {
        const index = this.vehicleTypes.findIndex(t => t.id === this.selectedId);
        if (index > -1) {
          this.vehicleTypes[index] = { ...this.vehicleTypes[index], ...this.typeForm.value };
        }
        this.notificationService.show('Vehicle type updated successfully', 'success', 3000);
      } else {
        const newType = {
          id: this.vehicleTypes.length + 1,
          ...this.typeForm.value
        };
        this.vehicleTypes.unshift(newType);
        this.notificationService.show('Vehicle type added successfully', 'success', 3000);
      }
      this.closeModal();
    } else {
      this.notificationService.show('Please fill required fields', 'error', 3000);
    }
  }

  toggleStatus(item: any) {
    item.status = item.status === 'Active' ? 'Inactive' : 'Active';
    this.notificationService.show(`Status changed to ${item.status}`, 'info', 2000);
  }

  // Search & Pagination
  get filteredTypes() {
    return this.vehicleTypes.filter(t => 
      t.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  onTableDataChange(event: any) {
    this.page = event;
  }
}

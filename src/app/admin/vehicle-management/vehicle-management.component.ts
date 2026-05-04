import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/mat/mat.module';
import { animate, style, transition, trigger } from '@angular/animations';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxPaginationModule, MaterialModule],
  templateUrl: './vehicle-management.component.html',
  styleUrl: './vehicle-management.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class VehicleManagementComponent implements OnInit {
  // Pagination
  page: number = 1;
  tableSize: any = 10;
  tableSizes: any = [10, 20, 50, 100, 'all'];
  totalRecords: number = 0;

  // Search
  searchbarform!: FormGroup;
  showreset: boolean = false;

  // Static Data for Selects
  manufacturerList = [
    { id: 1, name: 'Tata Motors' },
    { id: 2, name: 'Mahindra & Mahindra' },
    { id: 3, name: 'Ashok Leyland' },
    { id: 4, name: 'BharatBenz' },
    { id: 5, name: 'Eicher Motors' },
  ];

  modelList = [
    { id: 1, manufacturerId: 1, name: 'LPT 1613', type: 'Truck' },
    { id: 2, manufacturerId: 1, name: 'Starbus', type: 'Bus' },
    { id: 3, manufacturerId: 2, name: 'Bolero Pik-Up', type: 'Truck' },
    { id: 4, manufacturerId: 3, name: 'Dost', type: 'Mini Truck' },
  ];

  filteredModels: any[] = [];
  fuelTypes = ['Diesel', 'CNG', 'Electric', 'Petrol'];
  ownershipTypes = ['Owned', 'Attached'];
  conditions = ['New', 'Used'];

  // Vehicle Table Data
  vehicles: any[] = [
    {
      id: 1,
      regNo: 'RJ-14-GA-1234',
      chassisNo: 'CH1234567890',
      manufacturer: 'Tata Motors',
      model: 'LPT 1613',
      type: 'Truck',
      status: 'Draft',
      expiryAlert: 'None',
      documents: []
    }
  ];

  table_heading = [
    { heading0: 'Reg. Number', heading1: 'Manufacturer & Model', heading2: 'Vehicle Type', heading3: 'Ownership', heading4: 'Status', heading5: 'Alerts', heading6: 'Actions' }
  ];

  // Modals
  createModalOpen: boolean = false;
  viewModalOpen: boolean = false;
  updateDocsModalOpen: boolean = false;

  // Selected Data
  selectedVehicle: any;

  // Form
  vehicleForm!: FormGroup;
  updateDocsForm!: FormGroup;

  constructor(private fb: FormBuilder, private notificationService: NotificationService, private router: Router) {}

  ngOnInit(): void {
    this.searchbarform = this.fb.group({
      searchbar: ['', Validators.required],
    });

    this.initForm();
    this.totalRecords = this.vehicles.length;
  }

  // Navigation
  goToMaintenance(v: any) {
    this.router.navigate(['/admin/vehicle-maintenance', v.id]);
  }

  initForm() {
    this.vehicleForm = this.fb.group({
      chassisNo: ['', [Validators.required]],
      regNo: ['', [Validators.required]],
      manufacturerId: ['', Validators.required],
      modelId: ['', Validators.required],
      mfgYear: ['', Validators.required],
      color: [''],
      fuelType: ['', Validators.required],
      ownershipType: ['', Validators.required],
      condition: ['', Validators.required],
      vehicleType: [{ value: '', disabled: true }],
      capacity: ['', Validators.required],
      documents: this.fb.array([
        this.createDocGroup('RC'),
        this.createDocGroup('Insurance'),
        this.createDocGroup('PUC'),
        this.createDocGroup('Fitness Certificate'),
        this.createDocGroup('Permit'),
        this.createDocGroup('Vehicle Image'),
      ])
    });

    this.updateDocsForm = this.fb.group({
      documents: this.fb.array([])
    });
  }

  createDocGroup(label: string, isOther: boolean = false): FormGroup {
    return this.fb.group({
      label: [label],
      file: [null, Validators.required],
      expiryDate: ['', Validators.required],
      isOther: [isOther]
    });
  }

  get docArray() {
    return this.vehicleForm.get('documents') as FormArray;
  }

  get updateDocArray() {
    return this.updateDocsForm.get('documents') as FormArray;
  }

  addOtherDoc() {
    this.docArray.push(this.createDocGroup('', true));
  }

  addUpdateOtherDoc() {
    this.updateDocArray.push(this.createDocGroup('', true));
  }

  removeDoc(index: number) {
    this.docArray.removeAt(index);
  }

  removeUpdateDoc(index: number) {
    this.updateDocArray.removeAt(index);
  }

  // Handle Manufacturer Change
  onManufacturerChange() {
    const mId = this.vehicleForm.get('manufacturerId')?.value;
    this.filteredModels = this.modelList.filter(m => m.manufacturerId == mId);
    this.vehicleForm.get('modelId')?.setValue('');
    this.vehicleForm.get('vehicleType')?.setValue('');
  }

  // Handle Model Change
  onModelChange() {
    const modId = this.vehicleForm.get('modelId')?.value;
    const model = this.modelList.find(m => m.id == modId);
    if (model) {
      this.vehicleForm.get('vehicleType')?.setValue(model.type);
    }
  }

  // Pagination & Search
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

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
    this.vehicleForm.reset();
    this.initForm();
    this.createModalOpen = true;
  }

  closeModal() {
    this.createModalOpen = false;
    this.viewModalOpen = false;
    this.updateDocsModalOpen = false;
  }

  openViewModal(v: any) {
    this.selectedVehicle = v;
    this.viewModalOpen = true;
  }

  openUpdateDocsModal(v: any) {
    this.selectedVehicle = v;
    this.updateDocArray.clear();
    // Pre-populate with typical renewal docs or current vehicle docs
    const renewalDocs = ['Insurance Policy', 'Fitness Certificate', 'Permit'];
    renewalDocs.forEach(d => {
      this.updateDocArray.push(this.fb.group({
        label: [d],
        file: [null], // File can be optional for renewal if only date changes, but usually required
        expiryDate: [''],
        isOther: [false]
      }));
    });
    this.updateDocsModalOpen = true;
  }

  // File Upload placeholder
  onFileChange(event: any, index: number) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.docArray.at(index).get('file')?.setValue(file);
    }
  }

  // Save Vehicle
  saveVehicle() {
    if (this.vehicleForm.valid) {
      const formVal = this.vehicleForm.getRawValue();
      const manufacturer = this.manufacturerList.find(m => m.id == formVal.manufacturerId);
      const model = this.modelList.find(m => m.id == formVal.modelId);

      const newVehicle = {
        id: this.vehicles.length + 1,
        regNo: formVal.regNo,
        chassisNo: formVal.chassisNo,
        manufacturer: manufacturer?.name,
        model: model?.name,
        type: formVal.vehicleType,
        ownership: formVal.ownershipType,
        status: 'Draft',
        expiryAlert: 'None',
        documents: formVal.documents
      };

      this.vehicles.unshift(newVehicle);
      this.totalRecords = this.vehicles.length;
      this.notificationService.show('Vehicle created successfully with Draft status', 'success', 3000);
      this.closeModal();
    } else {
      this.notificationService.show('Please fill all mandatory fields and upload documents', 'error', 3000);
      this.markFormGroupTouched(this.vehicleForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  getAlertClass(alert: string): string {
    switch (alert) {
      case 'None': return 'badge-light';
      case 'Expired': return 'badge-danger';
      case 'Critical': return 'badge-warning';
      default: return 'badge-info';
    }
  }
}

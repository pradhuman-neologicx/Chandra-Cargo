import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from 'src/app/core/services/Employee.service';
import { JwtService } from 'src/app/core/services/jwt.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-designation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    NgxPaginationModule,
  ],
  templateUrl: './designation.component.html',
  styleUrl: './designation.component.scss',
  animations: [
    trigger('succesfullyMesaage', [
      state(
        'void',
        style({
          transform: 'translateX(-30%)',
          opacity: 0,
        }),
      ),
      transition(':enter, :leave', [
        animate('0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)'),
      ]),
    ]),
    trigger('slideIn', [
      state(
        'void',
        style({
          transform: 'translateX(100%)',
          opacity: 0,
        }),
      ),
      transition(':enter', [
        animate(
          '0.5s ease-out',
          style({
            transform: 'translateX(0)',
            opacity: 1,
          }),
        ),
      ]),
    ]),
    trigger('fadeIn', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'scale(0.5)',
        }),
      ),
      transition(':enter', [
        animate(
          '0.5s ease-out',
          style({
            opacity: 1,
            transform: 'scale(1)',
          }),
        ),
      ]),
    ]),
  ],
})
export class DesignationComponent implements OnInit {
  showreset: boolean = false;
  searchbarform!: FormGroup;
  createDesignationForm!: FormGroup;
  updateDesignationForm!: FormGroup;
  viewDesignationForm!: FormGroup;
  tableSize: any = 10;
  tableSizes: any = [10, 20, 50, 100, 'all'];
  totalRecords: any;
  page: number = 1;
  createDesignationOpen: boolean = false;
  updateDesignationOpen: boolean = false;
  viewDesignationOpen: boolean = false;
  currentDesignationId: any;

  mockDesignations: any[] = [
    { id: '1', name: 'Manager', is_active: 1 },
    { id: '2', name: 'Supervisor', is_active: 1 },
    { id: '3', name: 'Clerk', is_active: 0 },
    { id: '4', name: 'Driver', is_active: 1 },
    { id: '5', name: 'Loader', is_active: 1 },
    { id: '6', name: 'Team Lead', is_active: 1 },
    { id: '7', name: 'HR Executive', is_active: 1 },
    { id: '8', name: 'Accountant', is_active: 0 },
    { id: '9', name: 'Security Guard', is_active: 1 },
    { id: '10', name: 'Operation Manager', is_active: 1 },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private jwtService: JwtService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.searchbarform = this.formBuilder.group({
      searchbar: ['', [Validators.required]],
    });

    this.createDesignationForm = this.formBuilder.group({
      Name: ['', [Validators.required]],
    });

    this.updateDesignationForm = this.formBuilder.group({
      Name: ['', [Validators.required]],
    });

    this.viewDesignationForm = this.formBuilder.group({
      Name: [''],
    });
    this.GetDesignationFun();
  }

  designationList: any;
  table_heading = [
    {
      heading0: 'Serial No.',
      heading1: 'Name',
      heading2: 'Status',
      heading3: 'Action',
    },
  ];

  GetDesignationFun() {
    const searchText = this.searchbarform.get('searchbar')?.value?.toLowerCase();
    let filteredData = [...this.mockDesignations];

    if (searchText) {
      filteredData = this.mockDesignations.filter((d) =>
        d.name.toLowerCase().includes(searchText)
      );
    }

    this.totalRecords = filteredData.length;

    if (this.tableSize === 'all') {
      this.designationList = filteredData;
    } else {
      const startIndex = (this.page - 1) * this.tableSize;
      const endIndex = startIndex + this.tableSize;
      this.designationList = filteredData.slice(startIndex, endIndex);
    }
  }

  searchfun() {
    if (this.searchbarform.valid) {
      this.showreset = true;
      this.GetDesignationFun();
    } else {
      this.searchbarform.markAllAsTouched();
    }
  }

  resetsearchbar() {
    this.searchbarform.get('searchbar')?.reset();
    this.showreset = false;
    this.page = 1;
    this.GetDesignationFun();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.GetDesignationFun();
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.GetDesignationFun();
  }

  openAddModal() {
    this.createDesignationOpen = true;
  }

  closeModal() {
    this.createDesignationOpen = false;
    this.updateDesignationOpen = false;
    this.viewDesignationOpen = false;
    this.createDesignationForm.reset();
  }

  createDesignation() {
    if (this.createDesignationForm.valid) {
      const name = this.createDesignationForm.get('Name')?.value;
      const newId = (this.mockDesignations.length + 1).toString();
      this.mockDesignations.unshift({ id: newId, name: name, is_active: 1 });
      this.closeModal();
      this.notificationService.show('Designation created successfully', 'success', 3000);
      this.GetDesignationFun();
    } else {
      this.createDesignationForm.markAllAsTouched();
    }
  }

  OpenEditModal(designation: any): void {
    this.currentDesignationId = designation.id;
    this.updateDesignationOpen = true;
    this.updateDesignationForm.patchValue({ Name: designation.name });
  }

  updateDesignation() {
    if (this.updateDesignationForm.valid) {
      const name = this.updateDesignationForm.get('Name')?.value;
      const index = this.mockDesignations.findIndex((d) => d.id === this.currentDesignationId);
      if (index !== -1) {
        this.mockDesignations[index].name = name;
        this.closeModal();
        this.notificationService.show('Designation updated successfully', 'success', 3000);
        this.GetDesignationFun();
      }
    } else {
      this.updateDesignationForm.markAllAsTouched();
    }
  }

  openviewModal(designation: any): void {
    this.viewDesignationOpen = true;
    this.viewDesignationForm.patchValue({ Name: designation.name });
  }

  async Status(id: string, status: any) {
    const index = this.mockDesignations.findIndex((d) => d.id === id);
    if (index !== -1) {
      this.mockDesignations[index].is_active = status;
      this.notificationService.show(
        `Designation ${status ? 'activated' : 'deactivated'} successfully`,
        'success',
        2000
      );
      this.GetDesignationFun();
    }
  }
}

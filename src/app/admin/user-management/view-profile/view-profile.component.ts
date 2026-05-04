import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeService } from 'src/app/core/services/Employee.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95) translateY(-10px)' }),
        animate(
          '200ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'scale(1) translateY(0)' }),
        ),
      ]),
      transition(':leave', [
        animate(
          '150ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 0, transform: 'scale(0.95) translateY(-10px)' }),
        ),
      ]),
    ]),
  ],
})
export class ViewProfileComponent implements OnInit {
  staffId: any;
  staffData: any;
  isLoading: boolean = true;
  activeTab: string = 'details'; // Updated default tab
  selectedDate: string = new Date().toISOString().split('T')[0];

  // Edit Modal State
  isEditModalOpen: boolean = false;
  editForm!: FormGroup;

  // Mock document data
  employeeDocuments = [
    {
      name: 'Aadhar Card.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadDate: '12 Oct 2023',
    },
    {
      name: 'PAN Card.jpg',
      type: 'image',
      size: '1.1 MB',
      uploadDate: '12 Oct 2023',
    },
    {
      name: 'Offer Letter.pdf',
      type: 'pdf',
      size: '3.5 MB',
      uploadDate: '10 Oct 2023',
    },
    {
      name: 'Relieving Letter.pdf',
      type: 'pdf',
      size: '1.2 MB',
      uploadDate: '15 Oct 2023',
    },
    {
      name: 'Bank Passbook.jpg',
      type: 'image',
      size: '800 KB',
      uploadDate: '16 Oct 2023',
    },
  ];

  // Mock reference data for form dropdowns
  employmentTypes = ['Permanent', 'Contractual'];
  employmentStatuses = ['Active', 'Probation', 'Notice Period', 'Terminated'];
  branchesList = ['Jaipur', 'Delhi', 'Mumbai', 'Ahmedabad', 'Pune'];
  designationsList = ['Manager', 'Supervisor', 'Clerk', 'Driver', 'Loader'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.staffId = params['id'];
      if (this.staffId) {
        this.loadStaffProfile();
      }
    });

    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      address: ['', Validators.required],
      dob: ['', Validators.required],
      emergency_contact: ['', Validators.required],
      joining_date: ['', Validators.required],
      department: ['', Validators.required],
      designation: ['', Validators.required],
      employment_type: ['', Validators.required],
      status: ['', Validators.required],
      branches: [[]],
    });
  }

  loadStaffProfile() {
    this.isLoading = true;
    // Simulate API delay with mock data
    setTimeout(() => {
      this.staffData = {
        id: this.staffId || 101,
        name: 'Rahul Sharma',
        email: 'rahul@chandracargo.com',
        mobile: '9876543210',
        address: '123, Cargo Logistics Park, New Delhi, India 110037',
        dob: '1995-05-15',
        emergency_contact: '9988776655',
        joining_date: '2023-01-10',
        status: 'Active',
        is_active: 1,
        branches: ['Jaipur', 'Delhi'],
        department: { name: 'Operations' },
        role: { name: 'Manager' },
        employment_type: 'Permanent',
        reporting_manager: 'John Doe',
        assigned_station: 'Station Alpha',
        check_in: '09:00 AM',
        check_out: '06:00 PM',
      };
      this.isLoading = false;
    }, 800);
  }

  goBack() {
    this.router.navigate(['/admin/user-management/staff']);
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }

  onDateChange(event: any) {
    this.selectedDate = event.target.value;
    // Future: fetch stats for this date
  }

  openDatePicker(picker: HTMLInputElement) {
    if (picker.showPicker) {
      picker.showPicker();
    } else {
      picker.click();
    }
  }

  // Edit Modal Methods
  openEditModal() {
    this.editForm.patchValue({
      name: this.staffData.name,
      email: this.staffData.email,
      mobile: this.staffData.mobile,
      address: this.staffData.address,
      dob: this.staffData.dob,
      emergency_contact: this.staffData.emergency_contact,
      joining_date: this.staffData.joining_date,
      department: this.staffData.department?.name || '',
      designation:
        this.staffData.designation || this.staffData.role?.name || '',
      employment_type: this.staffData.employment_type || 'Permanent',
      status: this.staffData.status || 'Active',
      branches: this.staffData.branches || [],
    });
    this.isEditModalOpen = true;
  }

  closeModal() {
    this.isEditModalOpen = false;
  }

  onModalClickTarget(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeModal();
    }
  }

  saveChanges() {
    if (this.editForm.valid) {
      const formValue = this.editForm.value;

      // Update local state directly for immediate feedback (simulating API success)
      this.staffData = {
        ...this.staffData,
        name: formValue.name,
        email: formValue.email,
        mobile: formValue.mobile,
        address: formValue.address,
        dob: formValue.dob,
        emergency_contact: formValue.emergency_contact,
        joining_date: formValue.joining_date,
        department: { name: formValue.department },
        role: { name: formValue.designation },
        designation: formValue.designation,
        employment_type: formValue.employment_type,
        status: formValue.status,
        branches: formValue.branches,
      };

      this.closeModal();
    } else {
      Object.keys(this.editForm.controls).forEach((key) => {
        this.editForm.get(key)?.markAsTouched();
      });
    }
  }
}

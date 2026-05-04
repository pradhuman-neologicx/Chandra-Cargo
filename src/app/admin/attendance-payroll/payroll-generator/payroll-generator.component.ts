import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  selector: 'app-payroll-generator',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  templateUrl: './payroll-generator.component.html',
  styleUrl: './payroll-generator.component.scss',
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class PayrollGeneratorComponent implements OnInit {
  isEditModalOpen: boolean = false;
  editForm!: FormGroup;
  selectedEmployee: any = null;
  // Pagination
  page: number = 1;
  tableSize: any = 10;
  tableSizes: any = [10, 20, 50, 100, 'all'];
  totalRecords: number = 124;

  // Static Data
  employees = [
    {
      id: '#CS-8921',
      name: 'Robert Fox',
      initials: 'RF',
      avatarColor: '#E2E8F0',
      textColor: '#475569',
      dept: 'Logistics',
      workingHours: '168',
      totalHours: '160 hrs',
      grossPay: '₹5,400.00',
      deductions: '-₹420.00',
      netPay: '₹4,980.00',
    },
    {
      id: '#CS-4412',
      name: 'Jane Cooper',
      initials: 'JC',
      avatarColor: '#E2E8F0',
      textColor: '#475569',
      dept: 'Fleet Ops',
      workingHours: '160',
      totalHours: '160 hrs',
      grossPay: '₹6,200.00',
      deductions: '-₹580.00',
      netPay: '₹5,620.00',
    },
    {
      id: '#CS-7710',
      name: 'Guy Hawkins',
      initials: 'GH',
      avatarColor: '#E2E8F0',
      textColor: '#475569',
      dept: 'Warehouse',
      workingHours: '145',
      totalHours: '160 hrs',
      grossPay: '₹3,800.00',
      deductions: '-₹310.00',
      netPay: '₹3,490.00',
    },
    {
      id: '#CS-2105',
      name: 'Leslie Alexander',
      initials: 'LA',
      avatarColor: '#E2E8F0',
      textColor: '#475569',
      dept: 'Admin',
      workingHours: '160',
      totalHours: '160 hrs',
      grossPay: '₹4,200.00',
      deductions: '-₹415.00',
      netPay: '₹3,785.00',
    },
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      workingHours: ['', Validators.required],
      grossPay: ['', Validators.required],
      deductions: ['', Validators.required],
    });
  }

  generatePayroll() {
    this.notificationService.show(
      'Final Payroll Generated successfully',
      'success',
      3000,
    );
  }

  editRecord(emp: any) {
    this.selectedEmployee = emp;
    this.editForm.patchValue({
      workingHours: emp.workingHours,
      grossPay: emp.grossPay.replace('₹', '').replace(',', ''),
      deductions: emp.deductions.replace('-₹', '').replace(',', ''),
    });
    this.isEditModalOpen = true;
  }

  closeModal() {
    this.isEditModalOpen = false;
    this.selectedEmployee = null;
    this.editForm.reset();
  }

  saveChanges() {
    if (this.editForm.invalid) {
      this.notificationService.show(
        'Please fill required fields properly',
        'error',
        3000,
      );
      return;
    }

    const formValues = this.editForm.value;

    // Update the record in the array
    if (this.selectedEmployee) {
      this.selectedEmployee.workingHours = formValues.workingHours;

      const grossNum = parseFloat(formValues.grossPay);
      const dedNum = parseFloat(formValues.deductions);
      const netNum = grossNum - dedNum;

      this.selectedEmployee.grossPay =
        '₹' +
        grossNum.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      this.selectedEmployee.deductions =
        '-₹' +
        dedNum.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      this.selectedEmployee.netPay =
        '₹' +
        netNum.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

      this.notificationService.show(
        'Payroll details updated successfully',
        'success',
        3000,
      );
      this.closeModal();
    }
  }

  onModalClickTarget(event: MouseEvent) {
    event.stopPropagation();
  }

  viewSlip(emp: any) {
    this.router.navigate([
      '/admin/attendance-payroll/salary-slip',
      emp.id.replace('#', ''),
    ]);
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    // Future: API call
  }

  onTableDataChange(event: any) {
    this.page = event;
    // Future: API call
  }

  exportCSV() {
    this.notificationService.show('Export started', 'success', 3000);
  }
}

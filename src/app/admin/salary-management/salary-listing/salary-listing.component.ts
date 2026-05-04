import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { EmployeeService } from 'src/app/core/services/Employee.service';
import { JwtService } from 'src/app/core/services/jwt.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  selector: 'app-salary-listing',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './salary-listing.component.html',
  styleUrl: './salary-listing.component.scss',
})
export class SalaryListingComponent implements OnInit {
  // Pagination
  page: number = 1;
  tableSize: any = 10;
  tableSizes: any = [10, 20, 50, 100, 'all'];
  totalRecords: number = 8;

  // Filters
  searchbarform!: FormGroup;
  showreset: boolean = false;
  selectedMonth: string = '';
  selectedDepartment: string = '';

  // Summary Stats
  totalPayroll: string = '₹12,45,000';
  totalEmployees: number = 155;
  paidCount: number = 142;
  pendingCount: number = 13;

  // Department list
  departmentList = [
    { id: 1, name: 'Operations' },
    { id: 2, name: 'Logistics' },
    { id: 3, name: 'Fleet Ops' },
    { id: 4, name: 'Warehouse' },
    { id: 5, name: 'Admin' },
  ];

  // Month list
  monthList = [
    'January 2026', 'February 2026', 'March 2026', 'April 2026', 'May 2026',
  ];

  // Static employee salary data
  salaryData: any[] = [
    {
      id: 1,
      empId: 'EMP-101',
      name: 'Rahul Sharma',
      email: 'rahul@chandracargo.com',
      initials: 'RS',
      avatarColor: '#3366FF',
      role: 'Operations Manager',
      department: 'Operations',
      netSalary: '₹39,300',
      lastPaid: 'Apr 30, 2026',
      status: 'Paid',
    },
    {
      id: 2,
      empId: 'EMP-102',
      name: 'Priya Patel',
      email: 'priya@chandracargo.com',
      initials: 'PP',
      avatarColor: '#8B5CF6',
      role: 'Fleet Supervisor',
      department: 'Fleet Ops',
      netSalary: '₹31,100',
      lastPaid: 'Apr 30, 2026',
      status: 'Paid',
    },
    {
      id: 3,
      empId: 'EMP-103',
      name: 'Vikram Singh',
      email: 'vikram@chandracargo.com',
      initials: 'VS',
      avatarColor: '#F59E0B',
      role: 'Warehouse Lead',
      department: 'Warehouse',
      netSalary: '₹27,700',
      lastPaid: 'Apr 30, 2026',
      status: 'Pending',
    },
    {
      id: 4,
      empId: 'EMP-104',
      name: 'Anita Desai',
      email: 'anita@chandracargo.com',
      initials: 'AD',
      avatarColor: '#10B981',
      role: 'Logistics Coordinator',
      department: 'Logistics',
      netSalary: '₹24,600',
      lastPaid: 'Apr 30, 2026',
      status: 'Paid',
    },
    {
      id: 5,
      empId: 'EMP-105',
      name: 'Karan Mehta',
      email: 'karan@chandracargo.com',
      initials: 'KM',
      avatarColor: '#EF4444',
      role: 'Driver',
      department: 'Fleet Ops',
      netSalary: '₹19,700',
      lastPaid: 'Apr 30, 2026',
      status: 'Paid',
    },
    {
      id: 6,
      empId: 'EMP-106',
      name: 'Sneha Gupta',
      email: 'sneha@chandracargo.com',
      initials: 'SG',
      avatarColor: '#06B6D4',
      role: 'Admin Executive',
      department: 'Admin',
      netSalary: '₹22,200',
      lastPaid: '-',
      status: 'Pending',
    },
    {
      id: 7,
      empId: 'EMP-107',
      name: 'Amit Kumar',
      email: 'amit@chandracargo.com',
      initials: 'AK',
      avatarColor: '#64748B',
      role: 'Loader',
      department: 'Warehouse',
      netSalary: '₹16,300',
      lastPaid: 'Apr 30, 2026',
      status: 'Paid',
    },
    {
      id: 8,
      empId: 'EMP-108',
      name: 'Deepa Joshi',
      email: 'deepa@chandracargo.com',
      initials: 'DJ',
      avatarColor: '#EC4899',
      role: 'HR Assistant',
      department: 'Admin',
      netSalary: '₹21,100',
      lastPaid: 'Apr 30, 2026',
      status: 'Paid',
    },
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private jwtService: JwtService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.searchbarform = this.fb.group({
      searchbar: [''],
    });
  }

  // Search
  searchfun() {
    this.showreset = true;
    // Future: API search
  }

  resetsearchbar() {
    this.searchbarform.reset();
    this.showreset = false;
    // Future: API reset
  }

  // Filters
  onMonthChange(event: any) {
    this.selectedMonth = event.target.value;
    // Future: API call
  }

  onDepartmentFilterChange(event: any) {
    this.selectedDepartment = event.target.value;
    // Future: API call
  }

  // Pagination
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  // Actions
  viewPayslip(employee: any) {
    this.router.navigate(['/admin/salary-management/payslip-view', employee.id]);
  }

  exportCSV() {
    this.notificationService.show('Export started', 'success', 3000);
  }

  // Status helpers
  getStatusClass(status: string): string {
    switch (status) {
      case 'Paid':
        return 'status-paid';
      case 'Pending':
        return 'status-pending';
      default:
        return '';
    }
  }
}

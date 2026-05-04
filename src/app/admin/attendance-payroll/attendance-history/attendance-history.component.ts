import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmployeeService } from 'src/app/core/services/Employee.service';
import { JwtService } from 'src/app/core/services/jwt.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { AttendanceDetailComponent } from '../attendance-detail/attendance-detail.component';

@Component({
  selector: 'app-attendance-history',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    AttendanceDetailComponent,
  ],
  templateUrl: './attendance-history.component.html',
  styleUrl: './attendance-history.component.scss',
})
export class AttendanceHistoryComponent implements OnInit {
  searchbarform!: FormGroup;
  showreset: boolean = false;
  searchText: string = '';
  tableSize: any = 10;
  tableSizes: any = [10, 20, 50, 100, 'all'];
  totalRecords: number = 142;
  page: number = 1;
  selectedDepartment: string = '';
  selectedDateRange: string = 'this_week';
  selectedStatus: string = '';

  // Summary cards data (static)
  totalEmployees: number = 142;
  presentToday: number = 128;
  lateArrivals: number = 8;
  absentCount: number = 6;

  // Table headings
  table_heading = [
    {
      heading0: 'EMPLOYEE',
      heading1: 'DATE',
      heading2: 'DEPARTMENT',
      heading3: 'CHECK IN',
      heading4: 'CHECK OUT',
      heading5: 'WORK HOURS',
      heading6: 'STATUS',
      heading7: 'ACTION',
    },
  ];

  // Department list (static)
  departmentList: any[] = [
    { id: 1, name: 'Logistics' },
    { id: 2, name: 'Fleet Management' },
    { id: 3, name: 'Warehouse' },
    { id: 4, name: 'Operations' },
    { id: 5, name: 'Admin' },
  ];

  // Static attendance data matching the design
  attendanceData: any[] = [
    {
      id: 1,
      name: 'John Doe',
      empId: 'CF-001',
      avatar: null,
      initials: 'JD',
      avatarColor: '#3366FF',
      date: 'Oct 24, 2023',
      department: 'Logistics',
      clockIn: '08:55 AM',
      clockOut: '05:30 PM',
      workHours: '8h 35m',
      status: 'On Time',
    },
    {
      id: 2,
      name: 'Jane Cooper',
      empId: 'CF-042',
      avatar: null,
      initials: 'JC',
      avatarColor: '#8B5CF6',
      date: 'Oct 24, 2023',
      department: 'Fleet Management',
      clockIn: '09:15 AM',
      clockOut: '06:00 PM',
      workHours: '8h 45m',
      status: 'Late',
    },
    {
      id: 3,
      name: 'Robert Wilson',
      empId: 'CF-019',
      avatar: null,
      initials: 'RW',
      avatarColor: '#F59E0B',
      date: 'Oct 24, 2023',
      department: 'Warehouse',
      clockIn: '--:--',
      clockOut: '--:--',
      workHours: '0h 0m',
      status: 'Absent',
    },
    {
      id: 4,
      name: 'Guy Hawkins',
      empId: 'CF-022',
      avatar: null,
      initials: 'GH',
      avatarColor: '#10B981',
      date: 'Oct 24, 2023',
      department: 'Operations',
      clockIn: '08:30 AM',
      clockOut: '05:15 PM',
      workHours: '8h 45m',
      status: 'On Time',
    },
    {
      id: 5,
      name: 'Arlene McCoy',
      empId: 'CF-005',
      avatar: null,
      initials: 'AL',
      avatarColor: '#EF4444',
      date: 'Oct 24, 2023',
      department: 'Admin',
      clockIn: '09:05 AM',
      clockOut: '06:05 PM',
      workHours: '9h 00m',
      status: 'Late',
    },
    {
      id: 6,
      name: 'Savannah Nguyen',
      empId: 'CF-011',
      avatar: null,
      initials: 'SN',
      avatarColor: '#06B6D4',
      date: 'Oct 24, 2023',
      department: 'Logistics',
      clockIn: '08:45 AM',
      clockOut: '05:20 PM',
      workHours: '8h 35m',
      status: 'On Time',
    },
    {
      id: 7,
      name: 'Brooklyn Simmons',
      empId: 'CF-033',
      avatar: null,
      initials: 'BS',
      avatarColor: '#EC4899',
      date: 'Oct 24, 2023',
      department: 'Warehouse',
      clockIn: '09:20 AM',
      clockOut: '06:10 PM',
      workHours: '8h 50m',
      status: 'Late',
    },
    {
      id: 8,
      name: 'Cameron Williams',
      empId: 'CF-008',
      avatar: null,
      initials: 'CW',
      avatarColor: '#F97316',
      date: 'Oct 24, 2023',
      department: 'Fleet Management',
      clockIn: '08:50 AM',
      clockOut: '05:25 PM',
      workHours: '8h 35m',
      status: 'On Time',
    },
    {
      id: 9,
      name: 'Leslie Alexander',
      empId: 'CF-015',
      avatar: null,
      initials: 'LA',
      avatarColor: '#6366F1',
      date: 'Oct 24, 2023',
      department: 'Operations',
      clockIn: '--:--',
      clockOut: '--:--',
      workHours: '0h 0m',
      status: 'Absent',
    },
    {
      id: 10,
      name: 'Darrell Steward',
      empId: 'CF-027',
      avatar: null,
      initials: 'DS',
      avatarColor: '#14B8A6',
      date: 'Oct 24, 2023',
      department: 'Admin',
      clockIn: '08:40 AM',
      clockOut: '05:30 PM',
      workHours: '8h 50m',
      status: 'On Time',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private jwtService: JwtService,
    private notificationService: NotificationService,
    private router: Router,
  ) {}

  user_id: any;

  ngOnInit(): void {
    this.user_id = this.jwtService.getpanelUserId();
    this.searchbarform = this.formBuilder.group({
      searchbar: ['', [Validators.required]],
    });
    // In the future, replace with API call like:
    // this.GetAttendanceData();
  }

  // Placeholder for future API call
  // GetAttendanceData() {
  //   this.employeeService.GetAttendance(this.tableSize, this.page, this.searchText)
  //     .subscribe((response: any) => {
  //       if (response.status === 200 || response.status === 201) {
  //         this.attendanceData = response.data.records;
  //         this.totalRecords = response.data.total;
  //       }
  //     });
  // }

  searchfun() {
    if (this.searchbarform.valid) {
      this.showreset = true;
      this.searchText = this.searchbarform.get('searchbar')?.value;
      // Future: this.GetAttendanceData();
    } else {
      this.searchbarform.markAllAsTouched();
    }
  }

  resetsearchbar() {
    this.showreset = false;
    this.searchText = '';
    this.searchbarform.reset();
    // Future: this.GetAttendanceData();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    // Future: this.GetAttendanceData();
  }

  onTableDataChange(event: any) {
    this.page = event;
    // Future: this.GetAttendanceData();
  }

  onDepartmentFilterChange(event: any): void {
    this.selectedDepartment = event.target.value;
    this.page = 1;
    // Future: this.GetAttendanceByDepartment();
  }

  onDateRangeChange(event: any): void {
    this.selectedDateRange = event.target.value;
    this.page = 1;
    // Future: this.GetAttendanceData();
  }

  onStatusFilterChange(event: any): void {
    this.selectedStatus = event.target.value;
    this.page = 1;
    // Future: this.GetAttendanceData();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'On Time':
        return 'status-on-time';
      case 'Late':
        return 'status-late';
      case 'Absent':
        return 'status-absent';
      default:
        return '';
    }
  }

  goBack() {
    this.router.navigate(['/admin/user-management/staff']);
  }

  viewRecord(record: any) {
    this.router.navigate(['/admin/attendance-payroll/attendance-detail', record.id]);
  }

  editRecord(record: any) {
    console.log('Editing record:', record);
    // Future: logic to open edit modal
  }
}

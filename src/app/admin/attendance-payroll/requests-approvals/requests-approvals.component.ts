import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { EmployeeService } from 'src/app/core/services/Employee.service';
import { JwtService } from 'src/app/core/services/jwt.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  selector: 'app-requests-approvals',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxPaginationModule, FormsModule, ReactiveFormsModule],
  templateUrl: './requests-approvals.component.html',
  styleUrl: './requests-approvals.component.scss',
})
export class RequestsApprovalsComponent implements OnInit {
  activeTab: string = 'leave';
  selectedStatus: string = 'Pending';
  selectedType: string = '';
  selectAll: boolean = false;

  leaveCount: number = 12;
  totalRecords: number = 12;
  tableSize: any = 10;
  tableSizes: any = [10, 20, 50, 100, 'all'];
  page: number = 1;

  // Static leave requests
  leaveRequests: any[] = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Fleet Driver',
      empId: '#452',
      initials: 'JD',
      avatarColor: '#3366FF',
      requestType: 'Casual Leave',
      dateFrom: 'Oct 24',
      dateTo: 'Oct 26',
      duration: '3 DAYS',
      reason: 'Family...',
      attachment: 'PROOF.PDF',
      attachmentIcon: 'fa-solid fa-file-pdf',
      attachmentColor: '#10B981',
      status: 'Pending',
      selected: false,
    },
    {
      id: 2,
      name: 'Sarah Miller',
      role: 'Warehouse Lead',
      empId: '',
      initials: 'SM',
      avatarColor: '#8B5CF6',
      requestType: 'Sick Leave',
      dateFrom: 'Oct 22',
      dateTo: 'Oct 23',
      duration: '2 DAYS',
      reason: 'Medical...',
      attachment: 'CERT.JPG',
      attachmentIcon: 'fa-solid fa-file-image',
      attachmentColor: '#3366FF',
      status: 'Pending',
      selected: false,
    },
    {
      id: 3,
      name: 'Robert King',
      role: 'Logistics Planner',
      empId: '',
      initials: 'RK',
      avatarColor: '#EF4444',
      requestType: 'Vacation',
      dateFrom: 'Nov 10',
      dateTo: 'Nov 15',
      duration: '6 DAYS',
      reason: 'Planned...',
      attachment: 'TICKET.PDF',
      attachmentIcon: 'fa-solid fa-envelope',
      attachmentColor: '#F59E0B',
      status: 'Approved',
      selected: false,
    },
    {
      id: 4,
      name: 'Marcus Wong',
      role: 'Fleet Driver',
      empId: '#331',
      initials: 'MW',
      avatarColor: '#3366FF',
      requestType: 'Casual Leave',
      dateFrom: 'Oct 25',
      dateTo: 'Oct 25',
      duration: '1 DAY',
      reason: 'Personal...',
      attachment: '',
      attachmentIcon: '',
      attachmentColor: '',
      status: 'Pending',
      selected: false,
    },
  ];

  // Static attendance approvals
  attendanceApprovals: any[] = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Fleet Driver',
      empId: '#452',
      initials: 'JD',
      avatarColor: '#3366FF',
      requestType: 'Check-out Missing',
      dateFrom: 'Oct 21',
      dateTo: 'Oct 21',
      duration: '1 DAY',
      reason: 'Forgot to...',
      attachment: '',
      attachmentIcon: '',
      attachmentColor: '',
      status: 'Pending',
      selected: false,
    },
    {
      id: 2,
      name: 'Sarah Smith',
      role: 'Logistics Coord.',
      empId: '',
      initials: 'SS',
      avatarColor: '#8B5CF6',
      requestType: 'Late Correction',
      dateFrom: 'Oct 22',
      dateTo: 'Oct 22',
      duration: '1 DAY',
      reason: 'Traffic...',
      attachment: 'PROOF.PDF',
      attachmentIcon: 'fa-solid fa-file-pdf',
      attachmentColor: '#10B981',
      status: 'Pending',
      selected: false,
    },
  ];

  constructor(
    private employeeService: EmployeeService,
    private jwtService: JwtService,
    private notificationService: NotificationService,
    private router: Router,
  ) {}

  user_id: any;

  ngOnInit(): void {
    this.user_id = this.jwtService.getpanelUserId();
  }

  get currentData(): any[] {
    return this.activeTab === 'leave'
      ? this.leaveRequests
      : this.attendanceApprovals;
  }

  switchTab(tab: string) {
    this.activeTab = tab;
    this.selectAll = false;
    this.page = 1;
    this.currentData.forEach((r) => (r.selected = false));
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

  onStatusFilterChange(event: any) {
    this.selectedStatus = event.target.value;
    // Future: filter API call
  }

  onTypeFilterChange(event: any) {
    this.selectedType = event.target.value;
    // Future: filter API call
  }

  toggleSelectAll() {
    this.selectAll = !this.selectAll;
    this.currentData.forEach((r) => (r.selected = this.selectAll));
  }

  toggleSelect(item: any) {
    item.selected = !item.selected;
    this.selectAll = this.currentData.every((r) => r.selected);
  }

  get selectedCount(): number {
    return this.currentData.filter((r) => r.selected).length;
  }

  bulkApprove() {
    const selected = this.currentData.filter((r) => r.selected);
    if (selected.length === 0) {
      this.notificationService.show('No items selected', 'error', 3000);
      return;
    }
    selected.forEach((r) => (r.status = 'Approved'));
    this.notificationService.show(
      `${selected.length} request(s) approved`,
      'success',
      3000,
    );
    this.selectAll = false;
    this.currentData.forEach((r) => (r.selected = false));
  }

  exportCSV() {
    // Future: API call
    this.notificationService.show('Export started', 'success', 3000);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'Approved':
        return 'status-approved';
      case 'Rejected':
        return 'status-rejected';
      default:
        return '';
    }
  }

  approveRequest(item: any) {
    item.status = 'Approved';
    this.notificationService.show('Request approved successfully', 'success', 3000);
  }

  rejectRequest(item: any) {
    item.status = 'Rejected';
    this.notificationService.show('Request rejected successfully', 'error', 3000);
  }
}

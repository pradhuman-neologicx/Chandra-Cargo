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
  selectedStatus: string = '';

  leaveCount: number = 15;
  tableSize: any = 10;

  get totalRecords(): number {
    return this.currentData.length;
  }
  tableSizes: any = [10, 20, 50, 100, 'all'];
  page: number = 1;
  
  // Modal state
  showConfirmModal: boolean = false;
  confirmAction: 'Approve' | 'Reject' | '' = '';
  selectedItem: any = null;

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
    },
    {
      id: 5,
      name: 'Arlene McCoy',
      role: 'Admin',
      empId: '#105',
      initials: 'AM',
      avatarColor: '#10B981',
      requestType: 'Medical Leave',
      dateFrom: 'Oct 28',
      dateTo: 'Oct 30',
      duration: '3 DAYS',
      reason: 'Surgery recovery',
      attachment: 'DOC.PDF',
      attachmentIcon: 'fa-solid fa-file-pdf',
      attachmentColor: '#EF4444',
      status: 'Pending',
    },
    {
      id: 6,
      name: 'Guy Hawkins',
      role: 'Fleet Driver',
      empId: '#202',
      initials: 'GH',
      avatarColor: '#F59E0B',
      requestType: 'Casual Leave',
      dateFrom: 'Nov 01',
      dateTo: 'Nov 01',
      duration: '1 DAY',
      reason: 'Family Event',
      attachment: '',
      attachmentIcon: '',
      attachmentColor: '',
      status: 'Pending',
    },
    {
      id: 7,
      name: 'Eleanor Pena',
      role: 'Warehouse Assistant',
      empId: '#404',
      initials: 'EP',
      avatarColor: '#8B5CF6',
      requestType: 'Sick Leave',
      dateFrom: 'Oct 24',
      dateTo: 'Oct 25',
      duration: '2 DAYS',
      reason: 'Fever',
      attachment: '',
      attachmentIcon: '',
      attachmentColor: '',
      status: 'Pending',
    },
    {
      id: 8,
      name: 'Kristin Watson',
      role: 'Logistics Coord.',
      empId: '#505',
      initials: 'KW',
      avatarColor: '#EC4899',
      requestType: 'Vacation',
      dateFrom: 'Dec 20',
      dateTo: 'Dec 30',
      duration: '10 DAYS',
      reason: 'Winter Holidays',
      attachment: 'TICKET.PDF',
      attachmentIcon: 'fa-solid fa-file-pdf',
      attachmentColor: '#3B82F6',
      status: 'Pending',
    },
    {
      id: 9,
      name: 'Brooklyn Simmons',
      role: 'Fleet Driver',
      empId: '#303',
      initials: 'BS',
      avatarColor: '#14B8A6',
      requestType: 'Casual Leave',
      dateFrom: 'Nov 05',
      dateTo: 'Nov 06',
      duration: '2 DAYS',
      reason: 'Personal work',
      attachment: '',
      attachmentIcon: '',
      attachmentColor: '',
      status: 'Approved',
    },
    {
      id: 10,
      name: 'Cameron Williams',
      role: 'Operations Lead',
      empId: '#008',
      initials: 'CW',
      avatarColor: '#F97316',
      requestType: 'Sick Leave',
      dateFrom: 'Nov 02',
      dateTo: 'Nov 03',
      duration: '2 DAYS',
      reason: 'Common cold',
      attachment: '',
      attachmentIcon: '',
      attachmentColor: '',
      status: 'Pending',
    },
    {
      id: 11,
      name: 'Theresa Webb',
      role: 'Admin',
      empId: '#112',
      initials: 'TW',
      avatarColor: '#6366F1',
      requestType: 'Casual Leave',
      dateFrom: 'Oct 30',
      dateTo: 'Oct 30',
      duration: '1 DAY',
      reason: 'Bank work',
      attachment: '',
      attachmentIcon: '',
      attachmentColor: '',
      status: 'Pending',
    },
    {
      id: 12,
      name: 'Jacob Jones',
      role: 'Warehouse Assistant',
      empId: '#224',
      initials: 'JJ',
      avatarColor: '#F43F5E',
      requestType: 'Medical Leave',
      dateFrom: 'Nov 12',
      dateTo: 'Nov 14',
      duration: '3 DAYS',
      reason: 'Checkup',
      attachment: 'REPORT.PDF',
      attachmentIcon: 'fa-solid fa-file-pdf',
      attachmentColor: '#10B981',
      status: 'Pending',
    },
    {
      id: 13,
      name: 'Leslie Alexander',
      role: 'Fleet Driver',
      empId: '#315',
      initials: 'LA',
      avatarColor: '#06B6D4',
      requestType: 'Sick Leave',
      dateFrom: 'Oct 26',
      dateTo: 'Oct 27',
      duration: '2 DAYS',
      reason: 'Back pain',
      attachment: '',
      attachmentIcon: '',
      attachmentColor: '',
      status: 'Pending',
    },
    {
      id: 14,
      name: 'Bessie Cooper',
      role: 'Logistics Planner',
      empId: '#412',
      initials: 'BC',
      avatarColor: '#4F46E5',
      requestType: 'Vacation',
      dateFrom: 'Nov 20',
      dateTo: 'Nov 25',
      duration: '5 DAYS',
      reason: 'Trip',
      attachment: '',
      attachmentIcon: '',
      attachmentColor: '',
      status: 'Pending',
    },
    {
      id: 15,
      name: 'Dianne Russell',
      role: 'Fleet Driver',
      empId: '#511',
      initials: 'DR',
      avatarColor: '#10B981',
      requestType: 'Casual Leave',
      dateFrom: 'Nov 08',
      dateTo: 'Nov 08',
      duration: '1 DAY',
      reason: 'Personal',
      attachment: '',
      attachmentIcon: '',
      attachmentColor: '',
      status: 'Pending',
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
    },
    {
      id: 3,
      name: 'Arlene McCoy',
      role: 'Admin',
      empId: '#105',
      initials: 'AM',
      avatarColor: '#EF4444',
      requestType: 'Missing Check-in',
      dateFrom: 'Oct 23',
      dateTo: 'Oct 23',
      duration: '1 DAY',
      reason: 'Forgot...',
      attachment: '',
      attachmentIcon: '',
      attachmentColor: '',
      status: 'Pending',
    },
    {
      id: 4,
      name: 'Guy Hawkins',
      role: 'Fleet Driver',
      empId: '#202',
      initials: 'GH',
      avatarColor: '#F59E0B',
      requestType: 'Late Correction',
      dateFrom: 'Oct 24',
      dateTo: 'Oct 24',
      duration: '1 DAY',
      reason: 'Vehicle break...',
      attachment: '',
      attachmentIcon: '',
      attachmentColor: '',
      status: 'Pending',
    },
    {
      id: 5,
      name: 'Eleanor Pena',
      role: 'Warehouse',
      empId: '#404',
      initials: 'EP',
      avatarColor: '#10B981',
      requestType: 'Check-out Missing',
      dateFrom: 'Oct 25',
      dateTo: 'Oct 25',
      duration: '1 DAY',
      reason: 'Emergency...',
      attachment: '',
      attachmentIcon: '',
      attachmentColor: '',
      status: 'Pending',
    },
    {
      id: 6,
      name: 'Kristin Watson',
      role: 'Logistics',
      empId: '#505',
      initials: 'KW',
      avatarColor: '#3B82F6',
      requestType: 'Late Correction',
      dateFrom: 'Oct 26',
      dateTo: 'Oct 26',
      duration: '1 DAY',
      reason: 'Rain...',
      attachment: '',
      attachmentIcon: '',
      attachmentColor: '',
      status: 'Pending',
    },
    {
      id: 7,
      name: 'Brooklyn Simmons',
      role: 'Fleet Driver',
      empId: '#303',
      initials: 'BS',
      avatarColor: '#8B5CF6',
      requestType: 'Missing Check-in',
      dateFrom: 'Oct 27',
      dateTo: 'Oct 27',
      duration: '1 DAY',
      reason: 'System issue',
      attachment: '',
      attachmentIcon: '',
      attachmentColor: '',
      status: 'Pending',
    },
    {
      id: 8,
      name: 'Cameron Williams',
      role: 'Operations',
      empId: '#008',
      initials: 'CW',
      avatarColor: '#F97316',
      requestType: 'Late Correction',
      dateFrom: 'Oct 28',
      dateTo: 'Oct 28',
      duration: '1 DAY',
      reason: 'Fueling...',
      attachment: '',
      attachmentIcon: '',
      attachmentColor: '',
      status: 'Pending',
    },
    {
      id: 9,
      name: 'Theresa Webb',
      role: 'Admin',
      empId: '#112',
      initials: 'TW',
      avatarColor: '#6366F1',
      requestType: 'Check-out Missing',
      dateFrom: 'Oct 29',
      dateTo: 'Oct 29',
      duration: '1 DAY',
      reason: 'Late night...',
      attachment: '',
      attachmentIcon: '',
      attachmentColor: '',
      status: 'Pending',
    },
    {
      id: 10,
      name: 'Jacob Jones',
      role: 'Warehouse',
      empId: '#224',
      initials: 'JJ',
      avatarColor: '#F43F5E',
      requestType: 'Late Correction',
      dateFrom: 'Oct 30',
      dateTo: 'Oct 30',
      duration: '1 DAY',
      reason: 'Heavy traffic',
      attachment: '',
      attachmentIcon: '',
      attachmentColor: '',
      status: 'Pending',
    },
    {
      id: 11,
      name: 'Leslie Alexander',
      role: 'Fleet Driver',
      empId: '#315',
      initials: 'LA',
      avatarColor: '#06B6D4',
      requestType: 'Missing Check-in',
      dateFrom: 'Oct 31',
      dateTo: 'Oct 31',
      duration: '1 DAY',
      reason: 'App error',
      attachment: '',
      attachmentIcon: '',
      attachmentColor: '',
      status: 'Pending',
    },
    {
      id: 12,
      name: 'Bessie Cooper',
      role: 'Logistics',
      empId: '#412',
      initials: 'BC',
      avatarColor: '#4F46E5',
      requestType: 'Late Correction',
      dateFrom: 'Nov 01',
      dateTo: 'Nov 01',
      duration: '1 DAY',
      reason: 'Meeting...',
      attachment: '',
      attachmentIcon: '',
      attachmentColor: '',
      status: 'Pending',
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
    const data =
      this.activeTab === 'leave'
        ? this.leaveRequests
        : this.attendanceApprovals;

    if (this.selectedStatus) {
      return data.filter((item) => item.status === this.selectedStatus);
    }
    return data;
  }

  switchTab(tab: string) {
    this.activeTab = tab;
    this.page = 1;
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
    this.selectedItem = item;
    this.confirmAction = 'Approve';
    this.showConfirmModal = true;
  }

  rejectRequest(item: any) {
    this.selectedItem = item;
    this.confirmAction = 'Reject';
    this.showConfirmModal = true;
  }

  confirmActionProcess() {
    if (!this.selectedItem || !this.confirmAction) return;

    if (this.confirmAction === 'Approve') {
      this.selectedItem.status = 'Approved';
      this.notificationService.show('Request approved successfully', 'success');
    } else {
      this.selectedItem.status = 'Rejected';
      this.notificationService.show('Request rejected successfully', 'error');
    }

    this.closeConfirmModal();
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
    this.selectedItem = null;
    this.confirmAction = '';
  }
}

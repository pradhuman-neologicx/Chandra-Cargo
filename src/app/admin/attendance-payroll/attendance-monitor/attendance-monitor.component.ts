import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeService } from 'src/app/core/services/Employee.service';
import { JwtService } from 'src/app/core/services/jwt.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  selector: 'app-attendance-monitor',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './attendance-monitor.component.html',
  styleUrl: './attendance-monitor.component.scss',
})
export class AttendanceMonitorComponent implements OnInit {
  // Summary stats (static)
  presentToday: number = 142;
  totalEmployees: number = 155;
  presentPercentChange: string = '+5.2%';
  lateArrivals: number = 12;
  latePercentChange: string = '-2.4%';
  absentCount: number = 8;
  absentPercentChange: string = '+1%';
  pendingApprovals: number = 14;

  // Attendance corrections (static)
  corrections: any[] = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Fleet Driver',
      avatar: null,
      initials: 'JD',
      avatarColor: '#64748B',
      date: 'Oct 21, 2023',
      requestType: 'Check-out missing',
      requestDetail: 'Claim: 18:30 PM',
    },
    {
      id: 2,
      name: 'Sarah Smith',
      role: 'Logistics Coord.',
      avatar: null,
      initials: 'SS',
      avatarColor: '#8B5CF6',
      date: 'Oct 22, 2023',
      requestType: 'Late correction',
      requestDetail: 'Traffic delay proof',
    },
    {
      id: 3,
      name: 'Mike Ross',
      role: 'Warehouse Staff',
      avatar: null,
      initials: 'MR',
      avatarColor: '#F59E0B',
      date: 'Oct 22, 2023',
      requestType: 'Overtime claim',
      requestDetail: '2.5 hours extra',
    },
  ];

  totalCorrectionRequests: number = 14;

  // Upcoming leave (static)
  upcomingLeaves: any[] = [
    {
      id: 1,
      name: 'Emily Watson',
      leaveType: 'Sick Leave',
      duration: '2 Days',
      avatar: null,
      initials: 'EW',
      avatarColor: '#64748B',
      dateRange: 'Oct 24 - Oct 25',
      reason: 'Doctor appointment and follow-up rest.',
      status: 'PENDING',
    },
    {
      id: 2,
      name: 'Robert Chen',
      leaveType: 'Annual Leave',
      duration: '5 Days',
      avatar: null,
      initials: 'RC',
      avatarColor: '#64748B',
      dateRange: 'Oct 26 - Oct 31',
      reason: 'Family vacation trip.',
      status: 'PENDING',
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
    // Future: fetch data from API
  }

  approveCorrection(correction: any) {
    // Future: API call
    this.notificationService.show('Correction approved', 'success', 3000);
    this.corrections = this.corrections.filter((c) => c.id !== correction.id);
  }

  rejectCorrection(correction: any) {
    // Future: API call
    this.notificationService.show('Correction rejected', 'error', 3000);
    this.corrections = this.corrections.filter((c) => c.id !== correction.id);
  }

  approveLeave(leave: any) {
    // Future: API call
    this.notificationService.show('Leave approved', 'success', 3000);
    leave.status = 'APPROVED';
  }

  rejectLeave(leave: any) {
    // Future: API call
    this.notificationService.show('Leave rejected', 'error', 3000);
    leave.status = 'REJECTED';
  }

  viewAllQueue() {
    // Future: navigate to full queue
  }
}

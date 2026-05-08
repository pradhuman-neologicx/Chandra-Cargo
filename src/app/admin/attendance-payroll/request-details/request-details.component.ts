import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  selector: 'app-request-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './request-details.component.html',
  styleUrl: './request-details.component.scss',
})
export class RequestDetailsComponent implements OnInit {
  requestId: string | null = null;
  requestStatus: string = 'PENDING APPROVAL';

  // Static data matching the design
  employee = {
    name: 'John Doe',
    role: 'Warehouse Supervisor',
    empId: 'CL-9021',
    department: 'Operations',
    avatarLetter: 'JD',
    avatarColor: '#F2994A',
  };

  leaveBalance = {
    annualTotal: 20,
    annualUsed: 12,
    annualPercentage: 60,
    sickTotal: 10,
    sickUsed: 5,
    sickPercentage: 50,
    totalTaken: 17
  };

  requestDetails = {
    type: 'Annual Leave Application',
    duration: '3 Working Days',
    dateRange: 'Oct 12, 2023 - Oct 14, 2023',
    reason: 'Family vacation trip.',
    attachment: 'Vacation_schedule.pdf',
  };

  approvalFlow = [
    {
      role: 'Submitted by John Doe',
      date: 'Oct 10, 2023 at 09:15 AM',
      status: 'completed',
    },
    {
      role: 'Pending Operations Manager Approval',
      date: 'Awaiting your action',
      status: 'pending',
    },
  ];

  remarks: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.requestId = params.get('id');
      // In a real app, fetch details using this ID
    });
  }

  goBack(): void {
    this.location.back();
  }

  approveRequest(): void {
    this.notificationService.show(
      'Request approved successfully',
      'success',
      3000,
    );
    this.requestStatus = 'APPROVED';
    this.goBack();
  }

  rejectRequest(): void {
    if (!this.remarks.trim()) {
      this.notificationService.show(
        'Please provide a reason for rejection',
        'error',
        3000,
      );
      return;
    }
    this.notificationService.show('Request rejected', 'error', 3000);
    this.requestStatus = 'REJECTED';
    this.goBack();
  }
}

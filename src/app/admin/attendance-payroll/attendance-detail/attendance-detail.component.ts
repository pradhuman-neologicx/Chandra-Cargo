import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

interface AttendanceRecord {
  date: string;
  status: string;
  checkIn: string;
  checkOut: string;
  duration: string;
  remarks: string;
}

@Component({
  selector: 'app-attendance-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './attendance-detail.component.html',
  styleUrls: ['./attendance-detail.component.scss'],
  animations: [
    trigger('modalFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ]),
    trigger('overlayFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AttendanceDetailComponent implements OnInit {
  employeeId: any;
  employee: any = {
    name: 'John Doe',
    empId: 'CF-001',
    department: 'Logistics'
  };

  currentMonth: Date = new Date(2026, 4, 1); // May 2026
  daysInMonth: number[] = [];
  selectedDate: number = 4;
  
  attendanceRecords: AttendanceRecord[] = [
    { date: '01/05/2026', status: 'Present', checkIn: '09:31', checkOut: '18:07', duration: '08:36', remarks: '' },
    { date: '02/05/2026', status: 'Present', checkIn: '09:28', checkOut: '17:01', duration: '07:33', remarks: '' },
    { date: '03/05/2026', status: 'Weekend', checkIn: '-', checkOut: '-', duration: '-', remarks: '' },
    { date: '04/05/2026', status: 'Present', checkIn: '10:00', checkOut: '-', duration: '-', remarks: '' },
  ];

  isEditModalOpen: boolean = false;
  editForm: FormGroup;
  editingRecord: any = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.editForm = this.fb.group({
      status: ['Present'],
      checkIn: [''],
      checkOut: [''],
      remarks: ['']
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    this.generateCalendar();
    // Fill with mock data for the rest of the month
    for (let i = 5; i <= 31; i++) {
      const dateStr = `${i < 10 ? '0' + i : i}/05/2026`;
      const isWeekend = i % 7 === 2 || i % 7 === 3; // Mock weekends
      this.attendanceRecords.push({
        date: dateStr,
        status: isWeekend ? 'Weekend' : '-',
        checkIn: '-',
        checkOut: '-',
        duration: '-',
        remarks: ''
      });
    }
  }

  generateCalendar() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    this.daysInMonth = [];
    // Padding for first week
    for (let i = 0; i < firstDay; i++) {
      this.daysInMonth.push(0);
    }
    for (let i = 1; i <= totalDays; i++) {
      this.daysInMonth.push(i);
    }
  }

  getMonthName(): string {
    return this.currentMonth.toLocaleString('default', { month: 'long' });
  }

  openEditModal(record: any) {
    this.editingRecord = record;
    this.editForm.patchValue({
      status: record.status === '-' ? 'Present' : record.status,
      checkIn: record.checkIn === '-' ? '' : record.checkIn,
      checkOut: record.checkOut === '-' ? '' : record.checkOut,
      remarks: record.remarks
    });
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editingRecord = null;
  }

  updateAttendance() {
    if (this.editingRecord) {
      const formValue = this.editForm.value;
      this.editingRecord.status = formValue.status;
      this.editingRecord.checkIn = formValue.checkIn || '-';
      this.editingRecord.checkOut = formValue.checkOut || '-';
      this.editingRecord.remarks = formValue.remarks;
      
      // Calculate duration if both times are present
      if (formValue.checkIn && formValue.checkOut) {
        // Simple mock duration calculation
        this.editingRecord.duration = '08:00'; 
      }
      
      this.closeEditModal();
    }
  }

  onClose() {
    this.location.back();
  }

  goBack() {
    this.router.navigate(['/admin/attendance-payroll/attendance-history']);
  }
}

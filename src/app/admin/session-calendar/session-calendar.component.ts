import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isHoliday: boolean;
  isSunday: boolean;
  isSaturday: boolean;
  isPast: boolean;
  holidayName?: string;
}

@Component({
  selector: 'app-session-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './session-calendar.component.html',
  styleUrl: './session-calendar.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class SessionCalendarComponent implements OnInit {
  currentDate: Date = new Date();
  days: CalendarDay[] = [];
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  holidays: { [key: string]: string } = {}; // Format: 'YYYY-MM-DD': 'Holiday Name'

  get holidayList() {
    return Object.keys(this.holidays)
      .map((date) => ({ date, name: this.holidays[date] }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .filter(h => {
        const d = new Date(h.date);
        return d.getFullYear() === this.currentDate.getFullYear() && d.getMonth() === this.currentDate.getMonth();
      });
  }

  getMonthShort(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleString('default', { month: 'short' });
  }

  getDay(dateStr: string) {
    const d = new Date(dateStr);
    return d.getDate();
  }

  getFullDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('default', { weekday: 'long', year: 'numeric' });
  }

  removeHoliday(date: string, event: Event) {
    event.stopPropagation();
    if (this.canDeleteHoliday(date)) {
      this.holidayToDelete = date;
      this.showDeleteConfirmModal = true;
    }
  }

  confirmDelete() {
    if (this.holidayToDelete) {
      delete this.holidays[this.holidayToDelete];
      this.generateCalendar();
      this.cancelDelete();
    }
  }

  cancelDelete() {
    this.showDeleteConfirmModal = false;
    this.holidayToDelete = null;
  }

  canDeleteHoliday(dateStr: string): boolean {
    const todayStr = this.formatDate(new Date());
    // Only allow deletion for dates strictly after today
    return dateStr > todayStr;
  }

  // Modal State
  showHolidayModal: boolean = false;
  showConfigModal: boolean = false;
  showBulkUploadModal: boolean = false;
  showDeleteConfirmModal: boolean = false;
  holidayToDelete: string | null = null;
  isDragging: boolean = false;
  selectedFile: File | null = null;
  workingDays: number = 0; // 5 or 6
  modalDate: string = '';
  modalHolidayName: string = '';
  isEditing: boolean = false;
  minDate: string = '';

  ngOnInit(): void {
    this.minDate = this.formatDate(new Date());
    const storedConfig = localStorage.getItem('workingDays');
    if (storedConfig) {
      this.workingDays = parseInt(storedConfig);
    } else {
      this.showConfigModal = true;
    }
    this.generateCalendar();
  }

  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const startDay = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();
    
    this.days = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      this.days.push(this.createDayObject(date, false));
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i);
      this.days.push(this.createDayObject(date, true));
    }

    // Next month days
    const remainingSlots = 42 - this.days.length; // 6 weeks
    for (let i = 1; i <= remainingSlots; i++) {
      const date = new Date(year, month + 1, i);
      this.days.push(this.createDayObject(date, false));
    }

    this.autoMarkNonWorkingDays();
  }

  autoMarkNonWorkingDays(): void {
    if (this.workingDays === 0) return;

    this.days = this.days.map(day => {
      const dayOfWeek = day.date.getDay();
      const isSunday = dayOfWeek === 0;
      const isSaturday = dayOfWeek === 6;

      if (day.isCurrentMonth) {
        if (isSunday || (this.workingDays === 5 && isSaturday)) {
          const dateStr = this.formatDate(day.date);
          if (!this.holidays[dateStr]) {
            day.isHoliday = true;
            day.holidayName = isSunday ? 'Sunday Holiday' : 'Saturday Holiday';
            this.holidays[dateStr] = day.holidayName;
          }
        }
      }
      return day;
    });
  }

  createDayObject(date: Date, isCurrentMonth: boolean): CalendarDay {
    const dateStr = this.formatDate(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    return {
      date: date,
      isCurrentMonth: isCurrentMonth,
      isToday: date.toDateString() === today.toDateString(),
      isSunday: date.getDay() === 0,
      isSaturday: date.getDay() === 6,
      isPast: checkDate < today,
      isHoliday: !!this.holidays[dateStr],
      holidayName: this.holidays[dateStr]
    };
  }

  formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  prevMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.generateCalendar();
  }

  configureWorkingDays(days: number): void {
    this.workingDays = days;
    localStorage.setItem('workingDays', days.toString());
    this.showConfigModal = false;
    
    // Clear previously auto-marked weekend holidays to re-apply based on new config
    Object.keys(this.holidays).forEach(key => {
      if (this.holidays[key] === 'Sunday Holiday' || this.holidays[key] === 'Saturday Holiday') {
        delete this.holidays[key];
      }
    });

    this.generateCalendar();
  }

  openConfigModal(): void {
    this.showConfigModal = true;
  }

  addHoliday(): void {
    this.isEditing = false;
    this.modalDate = this.formatDate(new Date());
    this.modalHolidayName = '';
    this.showHolidayModal = true;
  }

  closeModal(): void {
    this.showHolidayModal = false;
    this.modalHolidayName = '';
  }

  saveHoliday(): void {
    if (this.modalDate) {
      // Use 'Holiday' as default name since we removed the input field
      this.holidays[this.modalDate] = this.holidays[this.modalDate] || 'Holiday';
      this.generateCalendar();
      this.closeModal();
    }
  }

  deleteHoliday(): void {
    if (this.modalDate) {
      delete this.holidays[this.modalDate];
      this.generateCalendar();
      this.closeModal();
    }
  }

  onDayClick(day: CalendarDay): void {
    if (day.isPast && !day.isHoliday) return;
    
    this.modalDate = this.formatDate(day.date);
    if (day.isHoliday) {
      this.isEditing = true;
      this.modalHolidayName = day.holidayName || '';
    } else {
      this.isEditing = false;
      this.modalHolidayName = '';
    }
    this.showHolidayModal = true;
  }

  bulkUpload(): void {
    this.showBulkUploadModal = true;
  }

  closeBulkModal(): void {
    this.showBulkUploadModal = false;
    this.selectedFile = null;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  removeFile(): void {
    this.selectedFile = null;
  }

  processBulkUpload(): void {
    if (this.selectedFile) {
      console.log('Processing file:', this.selectedFile.name);
      // Mock processing logic
      this.closeBulkModal();
    }
  }

  downloadSample(): void {
    console.log('Downloading sample template...');
    // Logic to download Excel/CSV template
  }
}

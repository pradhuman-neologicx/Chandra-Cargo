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

  // Modal State
  showHolidayModal: boolean = false;
  modalDate: string = '';
  modalHolidayName: string = '';
  isEditing: boolean = false;
  minDate: string = '';

  ngOnInit(): void {
    this.minDate = this.formatDate(new Date());
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

    this.autoMarkSundays();
  }

  autoMarkSundays(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= lastDay; i++) {
      const date = new Date(year, month, i);
      if (date.getDay() === 0) {
        const dateStr = this.formatDate(date);
        if (!this.holidays[dateStr]) {
          this.holidays[dateStr] = 'Sunday Holiday';
        }
      }
    }
    
    // We need to re-assign days to reflect holiday status in createDayObject
    // or just update the days array.
    this.days = this.days.map(day => {
      if (day.isSunday && day.isCurrentMonth && !day.isHoliday) {
        day.isHoliday = true;
        day.holidayName = 'Sunday Holiday';
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

  markAllSundaysAsHoliday(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= lastDay; i++) {
      const date = new Date(year, month, i);
      if (date.getDay() === 0) {
        const dateStr = this.formatDate(date);
        if (!this.holidays[dateStr]) {
          this.holidays[dateStr] = 'Sunday Holiday';
        }
      }
    }
    this.generateCalendar();
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
    if (this.modalHolidayName && this.modalDate) {
      this.holidays[this.modalDate] = this.modalHolidayName;
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
}

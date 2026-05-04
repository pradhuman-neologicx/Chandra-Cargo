import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  selector: 'app-payslip-view',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './payslip-view.component.html',
  styleUrl: './payslip-view.component.scss',
})
export class PayslipViewComponent implements OnInit {
  employeeId: string = '';

  // Employee info
  employee = {
    name: 'Rahul Sharma',
    empId: 'EMP-101',
    department: 'Operations',
    designation: 'Operations Manager',
    initials: 'RS',
    avatarColor: '#3366FF',
    joiningDate: 'Jan 10, 2023',
    bankAccount: 'SBI ****4291',
    panNumber: 'ABCDE1234F',
  };

  // Past monthly slips
  pastSlips = [
    { month: 'April 2026', net: '₹6,923.00', status: 'PAID', active: true },
    { month: 'March 2026', net: '₹6,923.00', status: 'PAID', active: false },
    { month: 'February 2026', net: '₹6,500.00', status: 'PAID', active: false },
    { month: 'January 2026', net: '₹6,500.00', status: 'PAID', active: false },
    { month: 'December 2025', net: '₹6,200.00', status: 'PAID', active: false },
  ];

  // Current slip details
  slipDetails = {
    month: 'April 2026',
    payPeriod: 'Apr 01, 2026 - Apr 30, 2026',
    payDate: 'Apr 30, 2026',
    workingDays: 26,
    daysWorked: 24,
    leaveTaken: 2,
    earnings: [
      { label: 'Basic Salary', amount: '₹5,200.00' },
      { label: 'Transport Allowance (TA)', amount: '₹400.00' },
      { label: 'Dearness Allowance (DA)', amount: '₹800.00' },
      { label: 'House Rent Allowance (HRA)', amount: '₹1,200.00' },
      { label: 'Special Allowance', amount: '₹650.00' },
    ],
    grossEarnings: '₹8,250.00',
    deductions: [
      { label: 'Provident Fund (PF)', amount: '₹312.00' },
      { label: 'Professional Tax', amount: '₹50.00' },
      { label: 'Health Insurance', amount: '₹120.00' },
      { label: 'Income Tax (TDS)', amount: '₹845.00' },
    ],
    totalDeductions: '₹1,327.00',
    netSalary: '₹6,923.00',
    disbursedOn: 'Apr 30, 2026',
    paymentMode: 'Bank Transfer',
  };

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.employeeId = params.get('id') || '';
    });
  }

  selectSlip(slip: any) {
    this.pastSlips.forEach((s) => (s.active = false));
    slip.active = true;
    this.slipDetails.month = slip.month;
    // Future: fetch slip details for the selected month
  }

  goBack(): void {
    this.location.back();
  }

  printSlip() {
    window.print();
  }

  downloadPDF() {
    this.notificationService.show('Downloading PDF...', 'success', 3000);
  }
}

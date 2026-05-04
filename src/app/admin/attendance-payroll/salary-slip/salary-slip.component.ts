import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-salary-slip',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './salary-slip.component.html',
  styleUrl: './salary-slip.component.scss',
})
export class SalarySlipComponent implements OnInit {
  employeeId: string = '';

  // Static past slips
  pastSlips = [
    { month: 'October 2023', net: '₹5,850.00', status: 'PAID', active: true },
    {
      month: 'September 2023',
      net: '₹5,850.00',
      status: 'PAID',
      active: false,
    },
    { month: 'August 2023', net: '₹5,750.00', status: 'PAID', active: false },
    { month: 'July 2023', net: '₹5,750.00', status: 'PAID', active: false },
    { month: 'June 2023', net: '₹5,700.00', status: 'PAID', active: false },
  ];

  // Static slip details
  slipDetails = {
    month: 'October 2023',
    empId: 'CRG-20485',
    dept: 'Cargo Logistics Dept.',
    earnings: [
      { label: 'Basic Pay', amount: '₹5,000.00' },
      { label: 'House Rent Allowance (HRA)', amount: '₹1,200.00' },
      { label: 'Conveyance Allowance', amount: '₹300.00' },
      { label: 'Performance Bonus', amount: '₹500.00' },
    ],
    grossEarnings: '₹7,000.00',
    deductions: [
      { label: 'Income Tax (TDS)', amount: '-₹850.00' },
      { label: 'Provident Fund (PF)', amount: '-₹250.00' },
      { label: 'Professional Tax', amount: '-₹50.00' },
    ],
    totalDeductions: '-₹1,150.00',
    netSalary: '₹5,850.00',
    disbursedOn: 'Oct 31, 2023',
    bank: 'Chase Manhattan ****4291',
    stats: {
      ytdEarnings: '₹64,500.00',
      taxInvested: '₹8,250.00',
      leaveBalance: '14.5 Days',
    },
  };

  constructor(
    private route: ActivatedRoute,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.employeeId = params.get('id') || 'Unknown';
      if (this.employeeId !== 'Unknown') {
        this.slipDetails.empId = `CS-${this.employeeId}`; // just to show it uses the ID
      }
    });
  }

  selectSlip(slip: any) {
    this.pastSlips.forEach((s) => (s.active = false));
    slip.active = true;
    this.slipDetails.month = slip.month;
    // In a real app, fetch slip details for the selected month
  }

  goBack(): void {
    this.location.back();
  }
}

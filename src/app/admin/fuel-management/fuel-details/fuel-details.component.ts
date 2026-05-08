import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';

import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-fuel-details',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxPaginationModule],
  templateUrl: './fuel-details.component.html',
  styleUrl: './fuel-details.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class FuelDetailsComponent implements OnInit {
  entryId: string | null = null;
  
  // Pagination
  page: number = 1;
  tableSize: number = 10;
  
  // Mock Data for the selected entry
  entryDetails: any = {
    vehicleReg: 'RJ-14-GA-1234',
    vehicleModel: 'Tata LPT 1613',
    date: '2026-05-01',
    station: 'HP Petrol Pump - Highway',
    driver: 'Rajesh Kumar',
    fuelType: 'Diesel',
    qty: 50.5,
    amount: 4500,
    odometer: 45200,
    mileage: 12.5,
    lastRefillGap: '350 KM',
    efficiencyStatus: 'Good'
  };

  // Mock History for this particular vehicle
  fuelHistory = [
    { date: '2026-05-01', station: 'HP Petrol Pump - Highway', qty: 50.5, amount: 4500, odometer: 45200, mileage: 12.5, driver: 'Rajesh Kumar' },
    { date: '2026-04-25', station: 'Bharat Petroleum - Main', qty: 45.0, amount: 4050, odometer: 44850, mileage: 11.8, driver: 'Suresh Singh' },
    { date: '2026-04-18', station: 'Reliance Fuel - East', qty: 52.0, amount: 4680, odometer: 44320, mileage: 12.2, driver: 'Amit Sharma' },
    { date: '2026-04-10', station: 'HP Petrol Pump - Highway', qty: 48.5, amount: 4365, odometer: 43680, mileage: 11.5, driver: 'Rajesh Kumar' },
  ];

  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.entryId = params.get('id');
      // In a real app, you would fetch details for this entryId and history for that vehicle
    });
  }

  goBack(): void {
    this.location.back();
  }

  onTableDataChange(event: any) {
    this.page = event;
  }
}

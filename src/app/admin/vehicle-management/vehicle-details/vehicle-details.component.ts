import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterialModule } from 'src/app/mat/mat.module';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-vehicle-details',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './vehicle-details.component.html',
  styleUrl: './vehicle-details.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class VehicleDetailsComponent implements OnInit {
  vehicleId!: string;
  vehicle: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.vehicleId = this.route.snapshot.paramMap.get('id') || '';
    this.fetchVehicleDetails();
  }

  fetchVehicleDetails() {
    // Mocking API Data Fetch based on ID
    this.vehicle = {
      id: this.vehicleId,
      regNo: 'NL-01-RA-4789',
      status: 'Active',
      general: {
        vehicleType: 'Truck',
        bodyType: 'Container',
        makerName: 'Tata Motors',
        modelName: 'LPT 1613',
        registrationDate: '2023-01-15',
        capacity: '20 Tons',
        chassisNo: 'CH123456789',
        engineNo: 'EN987654321',
        emission: 'BS-VI',
        fuelType: 'Diesel',
        color: 'Premium White',
        wheelbase: '3800 mm',
        hp: '160 BHP',
        ladenWeight: '16200 Kgs',
        unladenWeight: '6200 Kgs',
        grossWeight: '22400 Kgs'
      },
      invoice: {
        dealerInvoiceNo: 'INV/2023/001',
        invoiceDate: '2023-01-10',
        grnDate: '2023-01-12',
        hypothecation: 'HDFC Bank Ltd.',
        basePrice: '12,00,000',
        gstType: 'IGST',
        igst: '3,36,538.44',
        tcs: '3,365.38',
        invoicePrice: '15,41,826.82',
        amountInWords: 'fifteen lakh forty-one thousand eight hundred twenty-six only'
      },
      amc: {
        issuedBy: 'Tata Motors Service',
        amcNo: 'AMC-778899',
        amcType: 'Comprehensive',
        validFrom: '2023-02-01',
        validUpto: '2024-02-01',
        cost: '45,000'
      },
      insurance: {
        policyNo: 'POL998877',
        policyType: 'Comprehensive',
        issuer: 'ICICI Lombard',
        expiry: '2024-05-20',
        grandTotal: '28,500'
      },
      mapping: {
        driverName: 'Rajesh Kumar',
        licenseNo: 'DL-4552021',
        mobile: '9876543210',
        assignedOn: '2023-10-15',
        shift: 'Full Day',
        status: 'Active'
      }
    };
  }

  goBack() {
    this.router.navigate(['/admin/vehicle-management']);
  }

  editVehicle() {
    this.router.navigate(['/admin/vehicle-management/edit', this.vehicleId]);
  }

  goToMapping() {
    this.router.navigate(['/admin/vehicle-management/mapping']);
  }
}

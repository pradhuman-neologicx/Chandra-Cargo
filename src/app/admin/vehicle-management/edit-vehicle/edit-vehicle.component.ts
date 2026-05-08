import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterialModule } from 'src/app/mat/mat.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-edit-vehicle',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, FormsModule, NgSelectModule],
  templateUrl: './edit-vehicle.component.html',
  styleUrl: './edit-vehicle.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class EditVehicleComponent implements OnInit {
  vehicleForm!: FormGroup;
  vehicleId!: string;

  // Dropdown Options
  vehicleTypes = ['Truck', 'Mini Truck', 'Bus', 'Van', 'Tanker'];
  bodyTypes = ['Open Body', 'Container', 'Refrigerated', 'Flatbed'];
  conditions = ['New', 'Used'];
  manufacturers = ['Tata Motors', 'Mahindra', 'Ashok Leyland', 'BharatBenz', 'Eicher'];
  models = ['LPT 1613', 'Blazo X', 'Dost', '2823R', 'Pro 3015'];
  emissions = ['BS-IV', 'BS-VI', 'Euro 6'];
  fuelTypes = ['Diesel', 'CNG', 'Electric', 'Petrol'];
  amcProviders = ['Tata Motors Service', 'Mahindra First Choice', 'Local Workshop'];
  issuers = ['RTO', 'DTO', 'State Authority'];

  // File Upload States
  uploadedFiles: { [key: string]: File | null } = {
    amc: null,
    np: null,
    statePermit: null,
    insurance: null,
    pucc: null,
    fitness: null
  };

  // Accordion State
  activeSection: string = 'general';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  toggleSection(section: string) {
    this.activeSection = this.activeSection === section ? '' : section;
  }

  isSectionActive(section: string): boolean {
    return this.activeSection === section;
  }

  ngOnInit(): void {
    this.initForm();
    this.vehicleId = this.route.snapshot.paramMap.get('id') || '';
    if (this.vehicleId) {
      this.fetchVehicleData();
    }
  }

  initForm() {
    this.vehicleForm = this.fb.group({
      general: this.fb.group({
        vehicleType: ['', Validators.required],
        bodyType: ['', Validators.required],
        vehicleLength: [''],
        condition: ['', Validators.required],
        makerName: ['', Validators.required],
        modelName: ['', Validators.required],
        registrationDate: ['', Validators.required],
        capacity: ['', Validators.required],
        color: [''],
        chassisNo: ['', Validators.required],
        engineNo: ['', Validators.required],
        wheelbase: [''],
        emission: ['', Validators.required],
        hp: [''],
        ladenWeight: [''],
        unladenWeight: [''],
        grossWeight: [''],
        fuelType: ['', Validators.required],
      }),
      invoice: this.fb.group({
        dealerInvoiceNo: [''], invoiceDate: [''], grnDate: [''], hypothecation: [''],
        basePrice: [''], gstType: ['IGST'], igst: [''], tcs: [''], invoicePrice: [''], amountInWords: ['']
      }),
      amc: this.fb.group({
        issuedBy: [''], amcNo: [''], amcType: [''], validFrom: [''], validUpto: [''],
        avgRunningPerYear: [''], costWithoutTax: [''], gstOnAmc: [''], tcsOnAmc: [''],
        totalAmount: [''], paymentSchedule: [''], paymentStartDate: ['']
      }),
      np: this.fb.group({
        npAuthNo: [''], npDated: [''], permitCategory: ['Heavy Goods'], natureOfGoods: ['Non Hazardous'],
        docCharges: [''], totalCharge: [''], validFrom: [''], validUpto: ['']
      }),
      statePermit: this.fb.group({
        permitNo: [''], permitHolderName: [''], fathersName: [''], address: [''], validFor: [''],
        validInState: [''], registrationDate: [''], paymentTerms: [''], complianceDocType: [''],
        docCharges: [''], validFrom: [''], validUpto: ['']
      }),
      insurance: this.fb.group({
        policyNo: [''], policyType: [''], issuerName: [''], validFrom: [''], validUpto: [''],
        basicOD: [''], deductionsOD: [''], additionsOD: [''], totalOD: [''],
        basicTP: [''], deductionsTP: [''], additionsTP: [''], totalTP: [''],
        totalCombined: [''], gst: [''], cess: [''], grandTotal: [''],
        nomineeName: [''], relation: [''], age: ['']
      }),
      pucc: this.fb.group({
        puccNo: [''], customerNo: [''], customerMobileNo: [''], testDate: [''], testTime: [''],
        centerName: [''], centerAddress: [''], licenseNo: [''], docCharges: [''], validFrom: [''], validUpto: [''], issuerName: ['RTO']
      }),
      fitness: this.fb.group({
        applicationNo: [''], inspectionFeeReceiptNo: [''], receiptDate: [''], inspectedOn: [''],
        paymentTerms: [''], complianceDocType: [''], validFrom: [''], validUpto: [''], issuerName: ['DTO']
      })
    });
  }

  fetchVehicleData() {
    // Mocking API Data Fetch
    const mockData = {
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
        fuelType: 'Diesel'
      },
      invoice: { dealerInvoiceNo: 'INV/2023/001', basePrice: 1200000, gstType: 'IGST' },
      insurance: { policyNo: 'POL998877', policyType: 'Comprehensive' }
    };

    // Pre-filling the form
    this.vehicleForm.patchValue(mockData);
  }

  onFileSelected(event: any, section: string) {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFiles[section] = file;
      this.notificationService.show(`${section.toUpperCase()} document attached`, 'success', 2000);
    }
  }

  removeFile(section: string, event: Event) {
    event.stopPropagation();
    this.uploadedFiles[section] = null;
  }

  goBack() {
    this.router.navigate(['/admin/vehicle-management']);
  }

  saveVehicle() {
    if (this.vehicleForm.valid) {
      console.log('Updated Vehicle Data:', this.vehicleForm.value);
      this.notificationService.show('Vehicle updated successfully!', 'success', 3000);
      this.goBack();
    } else {
      this.notificationService.show('Please fill all mandatory fields', 'error', 3000);
      this.vehicleForm.markAllAsTouched();
    }
  }
}

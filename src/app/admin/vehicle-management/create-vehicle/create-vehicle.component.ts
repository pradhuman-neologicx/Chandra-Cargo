import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/mat/mat.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-create-vehicle',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, FormsModule, NgSelectModule],
  templateUrl: './create-vehicle.component.html',
  styleUrl: './create-vehicle.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class CreateVehicleComponent implements OnInit {
  vehicleForm!: FormGroup;

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

  initForm() {
    this.vehicleForm = this.fb.group({
      // 1. General Vehicle Details
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

      // 2. Vehicle Invoice
      invoice: this.fb.group({
        dealerInvoiceNo: [''],
        invoiceDate: [''],
        grnDate: [''],
        hypothecation: [''],
        basePrice: [''],
        gstType: ['IGST'],
        igst: [''],
        tcs: [''],
        invoicePrice: [''],
        amountInWords: ['']
      }),

      // 3. AMC
      amc: this.fb.group({
        issuedBy: [''],
        amcNo: [''],
        amcType: [''],
        validFrom: [''],
        validUpto: [''],
        avgRunningPerYear: [''],
        costWithoutTax: [''],
        gstOnAmc: [''],
        tcsOnAmc: [''],
        totalAmount: [''],
        paymentSchedule: [''],
        paymentStartDate: [''],
        paymentCloseDate: [''],
        vehicleRegNo: ['']
      }),

      // 4. National Permit
      np: this.fb.group({
        vehicleNo: [''],
        npAuthNo: [''],
        npDated: [''],
        permitCategory: ['Heavy Goods'],
        natureOfGoods: ['Non Hazardous'],
        docCharges: [''],
        miscCharges: [''],
        totalCharge: [''],
        issuerName: [''],
        validFrom: [''],
        validUpto: ['']
      }),

      // 5. State Permit (A)
      statePermit: this.fb.group({
        permitNo: [''],
        permitHolderName: [''],
        fathersName: [''],
        address: [''],
        validFor: [''],
        validInState: [''],
        vehicleRegNo: [''],
        registrationDate: [''],
        paymentTerms: [''],
        complianceDocType: [''],
        docCharges: [''],
        validFrom: [''],
        validUpto: [''],
        issuerName: ['']
      }),

      // 6. Vehicle Insurance
      insurance: this.fb.group({
        // General Info
        vehicleRegNo: [''],
        policyNo: [''],
        policyType: [''],
        issuerName: [''],
        validFrom: [''],
        validUpto: [''],
        // Premium Details
        basicOD: [''],
        deductionsOD: [''],
        additionsOD: [''],
        totalOD: [''],
        basicTP: [''],
        deductionsTP: [''],
        additionsTP: [''],
        totalTP: [''],
        totalCombined: [''],
        gst: [''],
        cess: [''],
        grandTotal: [''],
        // Nomination Details
        nomineeName: [''],
        relation: [''],
        age: ['']
      }),

      // 7. PUCC
      pucc: this.fb.group({
        vehicleRegNo: [''],
        puccNo: [''],
        customerNo: [''],
        customerMobileNo: [''],
        registrationDate: [''],
        testDate: [''],
        testTime: [''],
        centerName: [''],
        centerAddress: [''],
        licenseNo: [''],
        paymentTerms: [''],
        complianceDocType: [''],
        docCharges: [''],
        validFrom: [''],
        validUpto: [''],
        issuerName: ['RTO']
      }),

      // 8. Vehicle Fitness
      fitness: this.fb.group({
        vehicleRegNo: [''],
        applicationNo: [''],
        inspectionFeeReceiptNo: [''],
        receiptDate: [''],
        inspectedOn: [''],
        paymentTerms: [''],
        complianceDocType: [''],
        docCharges: [''],
        validFrom: [''],
        validUpto: [''],
        issuerName: ['DTO']
      })
    });
  }

  goBack() {
    this.router.navigate(['/admin/vehicle-management']);
  }

  saveVehicle() {
    if (this.vehicleForm.valid) {
      console.log('Vehicle Data:', this.vehicleForm.value);
      this.notificationService.show('Vehicle created successfully!', 'success', 3000);
      this.goBack();
    } else {
      this.notificationService.show('Please fill all mandatory fields', 'error', 3000);
      this.vehicleForm.markAllAsTouched();
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterialModule } from 'src/app/mat/mat.module';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-vehicle-document',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './vehicle-document.component.html',
  styleUrl: './vehicle-document.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class VehicleDocumentComponent implements OnInit {
  docForm!: FormGroup;
  vehicleId!: string;
  
  // Track uploaded files for each row
  selectedFiles: { [key: number]: File | null } = {};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.vehicleId = this.route.snapshot.paramMap.get('id') || '';
    this.initForm();
    this.loadExistingDocs();
  }

  initForm() {
    this.docForm = this.fb.group({
      documents: this.fb.array([])
    });
  }

  get documents(): FormArray {
    return this.docForm.get('documents') as FormArray;
  }

  addDocument(title: string = '', fileName: string = '') {
    const docGroup = this.fb.group({
      title: [title, Validators.required],
      fileName: [fileName],
      isExisting: [fileName !== '']
    });
    this.documents.push(docGroup);
  }

  removeDocument(index: number) {
    this.documents.removeAt(index);
    delete this.selectedFiles[index];
    this.notificationService.show('Document row removed', 'info', 2000);
  }

  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[index] = file;
      this.documents.at(index).get('fileName')?.setValue(file.name);
      this.notificationService.show(`File attached for row ${index + 1}`, 'success', 2000);
    }
  }

  loadExistingDocs() {
    // Mocking existing documents
    const existing = [
      { title: 'Pollution Certificate', fileName: 'pucc_2023.pdf' },
      { title: 'Fitness Report', fileName: 'fitness_july.pdf' }
    ];
    
    existing.forEach(doc => this.addDocument(doc.title, doc.fileName));
    
    // Add one empty row by default if none exist
    if (this.documents.length === 0) {
      this.addDocument();
    }
  }

  goBack() {
    this.router.navigate(['/admin/vehicle-management']);
  }

  saveDocuments() {
    if (this.docForm.valid) {
      console.log('Saving Documents:', this.docForm.value);
      console.log('Attached Files:', this.selectedFiles);
      this.notificationService.show('Documents updated successfully!', 'success', 3000);
      this.goBack();
    } else {
      this.notificationService.show('Please enter titles for all documents', 'error', 3000);
      this.docForm.markAllAsTouched();
    }
  }
}

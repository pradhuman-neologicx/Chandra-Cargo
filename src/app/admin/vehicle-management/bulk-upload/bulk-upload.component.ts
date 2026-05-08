import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaterialModule } from 'src/app/mat/mat.module';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-bulk-upload',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './bulk-upload.component.html',
  styleUrl: './bulk-upload.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class BulkUploadComponent {
  selectedFile: File | null = null;
  isDragging = false;

  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  goBack() {
    this.router.navigate(['/admin/vehicle-management']);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.validateAndSetFile(file);
    }
  }

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.validateAndSetFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  private validateAndSetFile(file: File) {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
      this.selectedFile = file;
    } else {
      this.notificationService.show('Please upload only Excel (.xlsx, .xls) or CSV files', 'error', 3000);
    }
  }

  downloadSample() {
    this.notificationService.show('Downloading sample file...', 'info', 2000);
    // Logic to download sample excel
  }

  uploadFile() {
    if (this.selectedFile) {
      this.notificationService.show('File uploaded successfully! Processing data...', 'success', 3000);
      // Simulate processing and go back
      setTimeout(() => this.goBack(), 2000);
    }
  }

  removeFile() {
    this.selectedFile = null;
  }
}

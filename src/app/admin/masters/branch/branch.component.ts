import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EmployeeService } from 'src/app/core/services/Employee.service';
import { JwtService } from 'src/app/core/services/jwt.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-branch',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    NgxPaginationModule,
  ],
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss'],
  animations: [
    trigger('succesfullyMesaage', [
      state(
        'void',
        style({
          transform: 'translateX(-30%)',
          opacity: 0,
        }),
      ),
      transition(':enter, :leave', [
        animate('0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)'),
      ]),
    ]),
    trigger('slideIn', [
      state(
        'void',
        style({
          transform: 'translateX(100%)',
          opacity: 0,
        }),
      ),
      transition(':enter', [
        animate(
          '0.5s ease-out',
          style({
            transform: 'translateX(0)',
            opacity: 1,
          }),
        ),
      ]),
    ]),
    trigger('fadeIn', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'scale(0.5)',
        }),
      ),
      transition(':enter', [
        animate(
          '0.5s ease-out',
          style({
            opacity: 1,
            transform: 'scale(1)',
          }),
        ),
      ]),
    ]),
  ],
})
export class BranchComponent implements OnInit {
  showreset: boolean = false;
  searchbarform!: FormGroup;
  createBranchForm!: FormGroup;
  updateBranchForm!: FormGroup;
  viewBranchForm!: FormGroup;
  tableSize: any = 10;
  tableSizes: any = [10, 20, 50, 100, 'all'];
  totalRecords: any;
  page: number = 1;
  createBranchOpen: boolean = false;
  updateBranchOpen: boolean = false;
  viewBranchOpen: boolean = false;
  currentBranchId: any;

  mockBranches: any[] = [
    {
      id: '1',
      name: 'Jaipur Main Office',
      code: 'JPR-01',
      city: 'Jaipur',
      is_active: 1,
    },
    {
      id: '2',
      name: 'Delhi Hub',
      code: 'DEL-01',
      city: 'New Delhi',
      is_active: 1,
    },
    {
      id: '3',
      name: 'Mumbai Warehouse',
      code: 'BUM-02',
      city: 'Mumbai',
      is_active: 0,
    },
    {
      id: '4',
      name: 'Ahmedabad Station',
      code: 'AMD-05',
      city: 'Ahmedabad',
      is_active: 1,
    },
    {
      id: '5',
      name: 'Pune Logistics Center',
      code: 'PNE-03',
      city: 'Pune',
      is_active: 1,
    },
    {
      id: '6',
      name: 'Gurgaon Branch',
      code: 'GGN-01',
      city: 'Gurgaon',
      is_active: 1,
    },
    {
      id: '7',
      name: 'Bangalore North',
      code: 'BLR-01',
      city: 'Bangalore',
      is_active: 1,
    },
    {
      id: '8',
      name: 'Kolkata East',
      code: 'KOL-02',
      city: 'Kolkata',
      is_active: 0,
    },
    {
      id: '9',
      name: 'Chennai South',
      code: 'CHN-04',
      city: 'Chennai',
      is_active: 1,
    },
    {
      id: '10',
      name: 'Hyderabad Main',
      code: 'HYD-01',
      city: 'Hyderabad',
      is_active: 1,
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private jwtService: JwtService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.searchbarform = this.formBuilder.group({
      searchbar: ['', [Validators.required]],
    });

    this.createBranchForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      city: ['', [Validators.required]],
    });

    this.updateBranchForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      city: ['', [Validators.required]],
    });

    this.viewBranchForm = this.formBuilder.group({
      name: [''],
      code: [''],
      city: [''],
    });
    this.GetBranchFun();
  }

  branchList: any;
  table_heading = [
    {
      heading0: 'Serial No.',
      heading1: 'Branch Name',
      heading2: 'Code',
      heading3: 'City',
      heading4: 'Status',
      heading5: 'Action',
    },
  ];

  GetBranchFun() {
    const searchText = this.searchbarform
      .get('searchbar')
      ?.value?.toLowerCase();
    let filteredData = [...this.mockBranches];

    if (searchText) {
      filteredData = this.mockBranches.filter(
        (d) =>
          d.name.toLowerCase().includes(searchText) ||
          d.code.toLowerCase().includes(searchText) ||
          d.city.toLowerCase().includes(searchText),
      );
    }

    this.totalRecords = filteredData.length;

    if (this.tableSize === 'all') {
      this.branchList = filteredData;
    } else {
      const startIndex = (this.page - 1) * this.tableSize;
      const endIndex = startIndex + this.tableSize;
      this.branchList = filteredData.slice(startIndex, endIndex);
    }
  }

  searchfun() {
    if (this.searchbarform.valid) {
      this.showreset = true;
      this.GetBranchFun();
    } else {
      this.searchbarform.markAllAsTouched();
    }
  }

  resetsearchbar() {
    this.searchbarform.get('searchbar')?.reset();
    this.showreset = false;
    this.page = 1;
    this.GetBranchFun();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.GetBranchFun();
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.GetBranchFun();
  }

  openAddModal() {
    this.createBranchOpen = true;
  }

  closeModal() {
    this.createBranchOpen = false;
    this.updateBranchOpen = false;
    this.viewBranchOpen = false;
    this.createBranchForm.reset();
  }

  createBranch() {
    if (this.createBranchForm.valid) {
      const formValue = this.createBranchForm.value;
      const newId = (this.mockBranches.length + 1).toString();
      this.mockBranches.unshift({
        id: newId,
        name: formValue.name,
        code: formValue.code,
        city: formValue.city,
        is_active: 1,
      });
      this.closeModal();
      this.notificationService.show(
        'Branch created successfully',
        'success',
        3000,
      );
      this.GetBranchFun();
    } else {
      this.createBranchForm.markAllAsTouched();
    }
  }

  OpenEditModal(branch: any): void {
    this.currentBranchId = branch.id;
    this.updateBranchOpen = true;
    this.updateBranchForm.patchValue({
      name: branch.name,
      code: branch.code,
      city: branch.city,
    });
  }

  updateBranch() {
    if (this.updateBranchForm.valid) {
      const formValue = this.updateBranchForm.value;
      const index = this.mockBranches.findIndex(
        (d) => d.id === this.currentBranchId,
      );
      if (index !== -1) {
        this.mockBranches[index] = {
          ...this.mockBranches[index],
          name: formValue.name,
          code: formValue.code,
          city: formValue.city,
        };
        this.closeModal();
        this.notificationService.show(
          'Branch updated successfully',
          'success',
          3000,
        );
        this.GetBranchFun();
      }
    } else {
      this.updateBranchForm.markAllAsTouched();
    }
  }

  openviewModal(branch: any): void {
    this.viewBranchOpen = true;
    this.viewBranchForm.patchValue({
      name: branch.name,
      code: branch.code,
      city: branch.city,
    });
  }

  async Status(id: string, status: any) {
    const index = this.mockBranches.findIndex((d) => d.id === id);
    if (index !== -1) {
      this.mockBranches[index].is_active = status;
      this.notificationService.show(
        `Branch ${status ? 'activated' : 'deactivated'} successfully`,
        'success',
        2000,
      );
      this.GetBranchFun();
    }
  }
}

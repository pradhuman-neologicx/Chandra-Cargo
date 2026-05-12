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
  states: any[] = [];
  cities: any[] = [];
  filteredCities: any[] = [];

  mockBranches: any[] = [
    {
      id: '1',
      name: 'Jaipur Main Office',
      state: 'Rajasthan',
      state_id: '1',
      city: 'Jaipur',
      city_id: '101',
      is_active: 1,
    },
    {
      id: '2',
      name: 'Delhi Hub',
      state: 'Delhi',
      state_id: '2',
      city: 'New Delhi',
      city_id: '102',
      is_active: 1,
    },
    {
      id: '3',
      name: 'Mumbai Warehouse',
      state: 'Maharashtra',
      state_id: '3',
      city: 'Mumbai',
      city_id: '103',
      is_active: 0,
    },
    {
      id: '4',
      name: 'Ahmedabad Station',
      state: 'Gujarat',
      state_id: '4',
      city: 'Ahmedabad',
      city_id: '104',
      is_active: 1,
    },
    {
      id: '5',
      name: 'Pune Logistics Center',
      state: 'Maharashtra',
      state_id: '3',
      city: 'Pune',
      city_id: '105',
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
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
    });

    this.updateBranchForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
    });

    this.viewBranchForm = this.formBuilder.group({
      name: [''],
      state: [''],
      city: [''],
    });
    this.GetBranchFun();
    this.getAllStates();
  }

  getAllStates() {
    this.employeeService.GetState().subscribe((res: any) => {
      this.states = res.data;
    });
  }

  onStateChange(event: any, mode: string) {
    const stateId = event.target.value;
    if (stateId) {
      this.employeeService.getCity(stateId).subscribe((res: any) => {
        this.filteredCities = res.data;
        if (mode === 'create') {
          this.createBranchForm.get('city')?.setValue('');
        } else if (mode === 'update') {
          this.updateBranchForm.get('city')?.setValue('');
        }
      });
    } else {
      this.filteredCities = [];
    }
  }

  branchList: any;
  table_heading = [
    {
      heading0: 'Serial No.',
      heading1: 'Branch Name',
      heading2: 'State',
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
          d.city.toLowerCase().includes(searchText) ||
          d.state.toLowerCase().includes(searchText),
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
      const selectedState = this.states.find(s => s.id == formValue.state);
      const selectedCity = this.filteredCities.find(c => c.id == formValue.city);
      
      this.mockBranches.unshift({
        id: newId,
        name: formValue.name,
        state: selectedState ? selectedState.name : '',
        state_id: formValue.state,
        city: selectedCity ? selectedCity.name : '',
        city_id: formValue.city,
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
    
    // Fetch cities for the branch's state before patching
    if (branch.state_id) {
      this.employeeService.getCity(branch.state_id).subscribe((res: any) => {
        this.filteredCities = res.data;
        this.updateBranchForm.patchValue({
          name: branch.name,
          state: branch.state_id,
          city: branch.city_id,
        });
      });
    } else {
      this.updateBranchForm.patchValue({
        name: branch.name,
        state: branch.state, // Fallback if state_id not available
        city: branch.city,
      });
    }
  }

  updateBranch() {
    if (this.updateBranchForm.valid) {
      const formValue = this.updateBranchForm.value;
      const index = this.mockBranches.findIndex(
        (d) => d.id === this.currentBranchId,
      );
      if (index !== -1) {
        const selectedState = this.states.find(s => s.id == formValue.state);
        const selectedCity = this.filteredCities.find(c => c.id == formValue.city);

        this.mockBranches[index] = {
          ...this.mockBranches[index],
          name: formValue.name,
          state: selectedState ? selectedState.name : (formValue.state || this.mockBranches[index].state),
          state_id: formValue.state,
          city: selectedCity ? selectedCity.name : (formValue.city || this.mockBranches[index].city),
          city_id: formValue.city,
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
      state: branch.state,
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

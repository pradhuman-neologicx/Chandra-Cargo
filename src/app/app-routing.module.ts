import { HomeComponent } from './website/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { ForgotPasswordComponent } from './admin/loginpages/forgot-password/forgot-password.component';
import { SigninComponent } from './admin/loginpages/signin/signin.component';
import { LoginpagesComponent } from './admin/loginpages/loginpages.component';
import { OtpComponent } from './admin/loginpages/otp/otp.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { StaffComponent } from './admin/user-management/staff/staff.component';
import { ViewProfileComponent } from './admin/user-management/view-profile/view-profile.component';
import { AttendanceHistoryComponent } from './admin/attendance-payroll/attendance-history/attendance-history.component';

import { AuthGuard } from './core/auth/auth-guard';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { ReportComponent } from './admin/report/report.component';
import { MastersComponent } from './admin/masters/masters.component';
import { DepartmentComponent } from './admin/masters/department/department.component';
import { AttendancePayrollComponent } from './admin/attendance-payroll/attendance-payroll.component';
import { AttendanceMonitorComponent } from './admin/attendance-payroll/attendance-monitor/attendance-monitor.component';
import { RequestsApprovalsComponent } from './admin/attendance-payroll/requests-approvals/requests-approvals.component';
import { RequestDetailsComponent } from './admin/attendance-payroll/request-details/request-details.component';
import { PayrollGeneratorComponent } from './admin/attendance-payroll/payroll-generator/payroll-generator.component';
import { SalarySlipComponent } from './admin/attendance-payroll/salary-slip/salary-slip.component';
import { DesignationComponent } from './admin/masters/designation/designation.component';
import { BranchComponent } from './admin/masters/branch/branch.component';
import { AttendanceDetailComponent } from './admin/attendance-payroll/attendance-detail/attendance-detail.component';
import { SalaryManagementComponent } from './admin/salary-management/salary-management.component';
import { SalaryListingComponent } from './admin/salary-management/salary-listing/salary-listing.component';
import { PayslipViewComponent } from './admin/salary-management/payslip-view/payslip-view.component';
import { VehicleManufacturerComponent } from './admin/masters/vehicle-manufacturer/vehicle-manufacturer.component';
import { VehicleModelComponent } from './admin/masters/vehicle-model/vehicle-model.component';
import { VehicleManagementComponent } from './admin/vehicle-management/vehicle-management.component';
import { VehicleMaintenanceComponent } from './admin/vehicle-maintenance/vehicle-maintenance.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: '',

    component: LoginpagesComponent,
    children: [
      { path: '', redirectTo: 'sign_in', pathMatch: 'full' },
      { path: 'sign_in', component: SigninComponent },
      { path: 'reset-password/:id/:token', component: OtpComponent },
      { path: 'forgot_password', component: ForgotPasswordComponent },
    ],
  },
  {
    path: 'admin',

    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'DashboardComponent', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'user-management',

        component: UserManagementComponent,
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'staff', pathMatch: 'full' },
          {
            path: 'staff',
            component: StaffComponent,
          },
          {
            path: 'view-profile/:id',
            component: ViewProfileComponent,
          },
        ],
      },

      {
        path: 'report',
        component: ReportComponent,
      },
      {
        path: 'master',
        component: MastersComponent,
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'department', pathMatch: 'full' },
          {
            path: 'department',
            component: DepartmentComponent,
          },
          {
            path: 'designation',
            component: DesignationComponent,
          },
          {
            path: 'branch',
            component: BranchComponent,
          },
          {
            path: 'vehicle-manufacturer',
            component: VehicleManufacturerComponent,
          },
          {
            path: 'vehicle-model',
            component: VehicleModelComponent,
          },
        ],
      },
      {
        path: 'attendance-payroll',
        component: AttendancePayrollComponent,
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'attendance-monitor', pathMatch: 'full' },
          {
            path: 'attendance-monitor',
            component: AttendanceMonitorComponent,
          },
          {
            path: 'attendance-history',
            component: AttendanceHistoryComponent,
          },
          {
            path: 'requests-approvals',
            component: RequestsApprovalsComponent,
          },
          {
            path: 'request-details/:id',
            component: RequestDetailsComponent,
          },
          {
            path: 'attendance-detail/:id',
            component: AttendanceDetailComponent,
          },
          // {
          //   path: 'payroll-generator',
          //   component: PayrollGeneratorComponent,
          // },
          // {
          //   path: 'salary-slip/:id',
          //   component: SalarySlipComponent,
          // },
        ],
      },
      {
        path: 'salary-management',
        component: SalaryManagementComponent,
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'salary-listing', pathMatch: 'full' },
          {
            path: 'salary-listing',
            component: SalaryListingComponent,
          },
          {
            path: 'payslip-view/:id',
            component: PayslipViewComponent,
          },
        ],
      },
      {
        path: 'vehicle-management',
        component: VehicleManagementComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'vehicle-maintenance/:id',
        component: VehicleMaintenanceComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtService } from 'src/app/core/services/jwt.service';

interface MenuItem {
  index: number;
  icon: string;
  label: string;
  route: string;
  subItems?: MenuItem[];
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  menuItems: MenuItem[] = [];
  @Input() collapsed: boolean = false;
  @Input() isMobile: boolean = false;
  @Output() closeSidenav = new EventEmitter<void>();

  constructor(
    private jwtService: JwtService,
    private router: Router,
  ) {}
  ProfilePicSizeClass(): string {
    return this.collapsed ? 'profile-pic-small' : 'profile-pic-large';
  }

  ShortnameB(): string {
    return this.collapsed ? 'shortname-small-b' : 'shortname-big-b';
  }

  Shortname(): string {
    return this.collapsed ? 'shortname-small' : 'shortname-big';
  }

  sideNavCollapsed(): boolean {
    return this.collapsed;
  }

  loginAS!: number;
  paneluserId!: String;
  roles: any;
  ngOnInit(): void {
    this.roles = this.jwtService.getadmiRole();
    this.menuItems = [];

    if (this.roles == 'admin') {
      this.menuItems = [
        {
          index: 1,
          icon: 'home',
          label: 'Dashboard',
          route: 'dashboard',
        },
        {
          index: 2,
          icon: 'widgets',
          label: 'Master',
          route: '/admin/master',
          subItems: [
            {
              index: 1,
              icon: 'inventory_2',
              label: 'Department',
              route: '/admin/master/department',
            },
            // {
            //   index: 2,
            //   icon: 'badge',
            //   label: 'Designation',
            //   route: '/admin/master/designation',
            // },
            {
              index: 3,
              icon: 'location_on',
              label: 'Branch',
              route: '/admin/master/branch',
            },
            {
              index: 4,
              icon: 'precision_manufacturing',
              label: 'Vehicle Manufacturer',
              route: '/admin/master/vehicle-manufacturer',
            },
            {
              index: 5,
              icon: 'directions_car',
              label: 'Vehicle Model',
              route: '/admin/master/vehicle-model',
            },
            {
              index: 6,
              icon: 'category',
              label: 'Vehicle Type',
              route: '/admin/master/vehicle-type',
            },
            {
              index: 7,
              icon: 'calendar_today',
              label: 'Calendar',
              route: '/admin/master/session-calendar',
            },
          ],
        },
        {
          index: 3,
          icon: 'supervisor_account',
          label: 'Employee Management',
          route: 'user-management/staff',
        },
        {
          index: 4,
          icon: 'calendar_month',
          label: 'Attendance Management',
          route: '/admin/attendance-payroll',
          subItems: [
            // {
            //   index: 1,
            //   icon: 'inventory_2',
            //   label: 'Attendance Monitor',
            //   route: '/admin/attendance-payroll/attendance-monitor',
            // },
            {
              index: 2,
              icon: 'event_note',
              label: 'Attendance History',
              route: '/admin/attendance-payroll/attendance-history',
            },
            {
              index: 3,
              icon: 'fact_check ',
              label: 'Requests & Approvals',
              route: '/admin/attendance-payroll/requests-approvals',
            },
            // {
            //   index: 3,
            //   icon: 'import_contacts',
            //   label: 'Payroll Generator',
            //   route: '/admin/attendance-payroll/payroll-generator',
            // },
          ],
        },
        {
          index: 5,
          icon: 'fingerprint',
          label: 'My Attendance',
          route: '/admin/emp-attendance',
        },
        // {
        //   index: 5,
        //   icon: 'payments',
        //   label: 'Salary Management',
        //   route: '/admin/salary-management/salary-listing',
        // },
        {
          index: 6,
          icon: 'local_shipping',
          label: 'Vehicle Management',
          route: '/admin/vehicle-management',
        },
        {
          index: 7,
          icon: 'local_gas_station',
          label: 'Fuel Management',
          route: '/admin/fuel-management',
        },
      ];
    } else if (this.roles == 'Engineer') {
      this.menuItems = [
        {
          index: 1,
          icon: 'home',
          label: 'Dashboard',
          route: 'dashboard',
        },
      ];
    } else if (this.roles == 'Front Desk Receptionist') {
      this.menuItems = [
        {
          index: 1,
          icon: 'home',
          label: 'Dashboard',
          route: 'dashboard',
        },
      ];
    }
  }

  removeDuplicateMenuItems(menuItems: any) {
    let uniqueItems: any;
    const seenRoutes = new Set();
    if (menuItems != undefined) {
      menuItems.forEach((item: any) => {
        if (item != undefined) {
          if (item.route != undefined) {
            if (!seenRoutes.has(item.route)) {
              uniqueItems.push(item);
              seenRoutes.add(item.route);
            }
          }
        }
      });
    }

    return uniqueItems;
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  closeSidebar() {
    this.collapsed = true;
  }
  ImageUrl!: String;

  name!: string;
  email!: string;

  getShortName(user: any) {
    if (this.name != undefined) {
      if (this.name != null) {
        return this.name.charAt(0);
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  isExpanded: boolean = false;

  // Function to toggle the expansion state
  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
  }

  expandedSubmenu: string | null = null;

  isSubmenuExpanded(route: string): boolean {
    return this.expandedSubmenu === route;
  }

  toggleSubmenu(route: string): void {
    if (this.expandedSubmenu === route) {
      this.expandedSubmenu = null;
    } else {
      this.expandedSubmenu = route;
    }
  }
  closeSubmenu(): void {
    this.expandedSubmenu = null; // Close submenu
  }
}

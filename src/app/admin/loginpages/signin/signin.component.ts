import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  OtpVerify,
  SendOtp,
  SignINRes,
  SignIn,
} from 'src/app/core/model-class/login-signup';
import { Validations } from 'src/app/core/model-class/validations';
import { JwtService } from 'src/app/core/services/jwt.service';
import { LoginService } from 'src/app/core/services/login.service';
import { ApiService } from 'src/app/core/services/api.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
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
            transform: 'translateX(0)', // Final position for slide-in effect
            opacity: 1, // Final opacity
          }),
        ),
      ]),
    ]),
  ],
})
export class SigninComponent {
  title = 'Login';
  login!: string;

  Onselectlogin(value: any) {
    this.login = value;
  }
  signIn!: FormGroup;
  openSecondsuccess: boolean = false;
  successName: any = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private apiservice: ApiService,
    private dataService: DataService,
    private jwtService: JwtService,
    private notificationService: NotificationService,
    private loginService: LoginService,
  ) {}
  // validation: Validations = new Validations();
  loginAS!: number;
  email_pattern = '^[A-Za-z0-9_.]+@[a-zA-Z]+(\\.[a-zA-Z]{2,4})+$';
  ngOnInit(): void {
    // this.jwtService.clearStorage();
    this.signIn = this.formBuilder.group({
      Email: [
        '',
        [Validators.required, Validators.pattern(this.email_pattern)],
      ],
      Otp: [''],
    });
  }

  // SignIn: SignIn = new SignIn();
  // SignINRes: SignINRes = new SignINRes();
  errorMessage: any;
  showErrorMessage: boolean = false;
  submitted!: boolean;
  isOtpSent: boolean = false;
  loginType!: number;
  sessionId!: string;
  otp_pattern = '^[0-9]{6}$';

  markAllAsTouched() {
    for (const control in this.signIn.controls) {
      if (this.signIn.controls.hasOwnProperty(control)) {
        this.signIn.controls[control].markAsTouched();
      }
    }
  }
  password: string = 'password';
  show: boolean = false;

  closeModal() {
    this.openSecondsuccess = false;
  }

  sendOtp() {
    this.errorMessage = '';
    if (this.signIn.get('Email')?.valid) {
      const formData: FormData = new FormData();
      formData.append('email', this.signIn.get('Email')?.value);
      // this.loginService.AdminLoginapi(formData).subscribe((response: any) => {
      //   if (response.status === 200) {
      //     this.isOtpSent = true;
      //     this.notificationService.show(response.message, 'success');
      //     this.signIn
      //       .get('Otp')
      //       ?.setValidators([
      //         Validators.required,
      //         Validators.minLength(6),
      //         Validators.maxLength(6),
      //         Validators.pattern(this.otp_pattern),
      //       ]);
      //     this.signIn.get('Otp')?.updateValueAndValidity();
      //   } else {
      //     this.errorMessage = response.message;
      //   }
      // });

      // Static Mock Logic
      this.isOtpSent = true;
      this.notificationService.show(
        'OTP Sent Successfully (Static)',
        'success',
      );
      this.signIn
        .get('Otp')
        ?.setValidators([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern(this.otp_pattern),
        ]);
      this.signIn.get('Otp')?.updateValueAndValidity();
    } else {
      this.signIn.get('Email')?.markAsTouched();
      this.errorMessage = 'Please enter a valid email';
    }
  }

  VerifyOtpfun() {
    this.errorMessage = '';
    if (this.signIn.valid) {
      const formData: FormData = new FormData();
      formData.append('email', this.signIn.get('Email')?.value);
      formData.append('otp', this.signIn.get('Otp')?.value);

      // this.loginService.VerifyOTP(formData, {}).subscribe((response: any) => {
      //   this.errorMessage = response.message;
      //   if (response.status === 200) {
      //     this.closeModal();
      //     this.submitted = true;
      //     this.successName = 'Login';
      //     setTimeout(() => {
      //       this.openSecondsuccess = true;
      //       setTimeout(() => {
      //         this.openSecondsuccess = false;
      //         this.jwtService.savepanelUserId(response.data.id);
      //         this.jwtService.saveadminame(response.data.name);
      //         this.jwtService.saveAdminToken(response.token);
      //         this.jwtService.saveAdminRole(response.data.role.name);
      //         this.jwtService.isLoggedIn(true);
      //         this.ngOnInit();
      //         this.router.navigate(['admin/dashboard']);
      //       }, 1800);
      //     }, 200);
      //   } else {
      //     this.submitted = false;
      //   }
      // });

      // Static Mock Logic
      if (this.signIn.get('Otp')?.value === '123456') {
        this.closeModal();
        this.submitted = true;
        this.successName = 'Login';
        setTimeout(() => {
          this.openSecondsuccess = true;
          setTimeout(() => {
            this.openSecondsuccess = false;
            // Mocking token and user data
            this.jwtService.savepanelUserId('1');
            this.jwtService.saveadminame('Admin User');
            this.jwtService.saveAdminToken('mock-token-123');
            this.jwtService.saveAdminRole('admin');
            this.jwtService.isLoggedIn(true);
            this.ngOnInit();
            this.router.navigate(['admin/dashboard']);
          }, 1800);
        }, 200);
      } else {
        this.errorMessage = 'Invalid OTP (Use 123456)';
        this.submitted = false;
      }
    } else {
      this.submitted = false;
      this.errorMessage = 'Please enter the OTP';
      this.signIn.markAllAsTouched();
    }
  }

  findInvalidControls(formName: any) {
    const invalid = [];
    const controls = formName.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log(invalid);
    return invalid;
  }

  resetEmail() {
    this.isOtpSent = false;
    this.signIn.get('Otp')?.clearValidators();
    this.signIn.get('Otp')?.updateValueAndValidity();
    this.signIn.get('Otp')?.reset();
  }
}

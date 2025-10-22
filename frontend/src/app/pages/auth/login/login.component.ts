import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  hidePassword = true;
  
  /** 登入成功後要跳轉的 URL */
  private returnUrl: string = '/';  // ← 新增

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute  // ← 新增
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    // 讀取 returnUrl 參數
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        console.log('登入成功');
        // 跳轉到 returnUrl 或預設首頁
        this.router.navigateByUrl(this.returnUrl);  // ← 改這裡
      },
      error: (error) => {
        console.error('登入失敗', error);
        this.errorMessage = this.getErrorMessage(error);
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  // ... 其他方法保持不變
  private getErrorMessage(error: any): string {
    if (error.status === 401) {
      return '帳號或密碼錯誤';
    }
    if (error.status === 0) {
      return '無法連線到伺服器';
    }
    return error.error?.detail || '登入失敗，請稍後再試';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    
    if (control?.hasError('required') && control.touched) {
      return '此欄位為必填';
    }
    
    if (control?.hasError('minlength') && control.touched) {
      return '密碼至少需要 6 個字元';
    }
    
    return '';
  }
}
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { UserData, UserDataResponse } from '../../models/user/user-data.interface';
import { jwtDecode } from 'jwt-decode';
import { STORED_KEYS } from '../../../constants/storedKeys';
import { Router } from '@angular/router';

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  statusMsg: string;
  message: string;
}

export interface VerifyResetCodeRequest {
  resetCode: string;
}

export interface VerifyResetCodeResponse {
  status: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);

  userDataDecoded: any = null;

  sendRegisterData(userdata: UserData): Observable<UserDataResponse> {
    return this.httpClient.post<UserDataResponse>(
      environment.base_url + 'auth/signup',
      userdata
    );
  }

  sendLoginData(userdata: UserData): Observable<UserDataResponse> {
    return this.httpClient.post<UserDataResponse>(
      environment.base_url + 'auth/signin',
      userdata
    );
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<ForgotPasswordResponse> {
    return this.httpClient.post<ForgotPasswordResponse>(
      environment.base_url + 'auth/forgotPasswords',
      data
    );
  }

  verifyResetCode(data: VerifyResetCodeRequest): Observable<VerifyResetCodeResponse> {
    return this.httpClient.post<VerifyResetCodeResponse>(
      environment.base_url + 'auth/verifyResetCode',
      data
    );
  }

  resetPassword(data: ResetPasswordRequest): Observable<ResetPasswordResponse> {
    return this.httpClient.put<ResetPasswordResponse>(
      environment.base_url + 'auth/resetPassword',
      data
    );
  }

  decodeUserToken(): void {
    if (localStorage.getItem(STORED_KEYS.userToken)) {
      this.userDataDecoded = jwtDecode(
        localStorage.getItem(STORED_KEYS.userToken)!
      );

      console.log(this.userDataDecoded, 'user-data');
    }
  }

  userLogOut(): void {
    localStorage.removeItem(STORED_KEYS.userToken);
    this.router.navigate(['/login']);
  }
}
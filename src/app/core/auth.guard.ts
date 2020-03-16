import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()

export class AuthGuard implements CanActivate {

    constructor (public auth: AuthService, public router: Router){}

    canActivate(): boolean {
        if (this.auth.currentUser$.getValue() == null || this.auth.currentUser$.getValue().userName == null)
        {
            this.router.navigate(['/login']);
            return false;
        }
        
        return true;
    }
}
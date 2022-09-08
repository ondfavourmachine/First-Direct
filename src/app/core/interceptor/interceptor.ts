import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    intercept(req:HttpRequest<any>, next:HttpHandler): Observable<HttpEvent<any>>{
        const token = sessionStorage.getItem('lorem')
    const reqWithHead  =  req.clone({
            setHeaders: {
            Authorization: `Bearer ${token}`,
            "Permissions-Policy": "camera=*,geolocation=*,microphone=*,autoplay=*,fullscreen=*,picture-in-picture=*,sync-xhr=*,encrypted-media=*,oversized-images=*",
            "Strict-Transport-Security": "max-age=31536000; includeSubdomains",
            "X-Frame-Options": "DENY",
            "X-Content-Type-Options": "nosniff",
            "X-Xss-Protection": "1; mode=block",
            "Content-Security-Policy": "script-src https: 'unsafe-inline' 'unsafe-eval';style-src https: 'unsafe-inline' 'unsafe-eval';img-src https: data:;font-src https: data:;",    
            }
        })
        return next.handle(reqWithHead)
    }
}


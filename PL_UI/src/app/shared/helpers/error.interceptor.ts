import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { ClientError } from '../models/clientError';
import { isObject } from './utils';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            const errors: Array<ClientError> = err.error;
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                location.reload();
            }

            return throwError(this.ErrorGenerator(err));
        })



        );



    }
    ErrorGenerator(errors) {
        let errorMessage: ClientError = new ClientError();
        errorMessage.StatusCode = "";
        errorMessage.Message = "";

        var modelErrors = errors.error[""];
        if (modelErrors) {
            errorMessage.StatusCode = errors.status;
            var errormsgs = '<ul>';
            modelErrors.forEach(function (item) {
                errorMessage.Message += '<li>' + item + '</li>';
            })
            errormsgs += '</ul>';
        }
        else if (isObject(errors)) {
            var errormsgs = '<ul>';
            for (let value of Object.values(errors.error)) {
                errormsgs += '<li>' + value + '</li>';
            }
            errormsgs += '</ul>';
            errorMessage.Message = errormsgs;
            errorMessage.StatusCode=errors.StatusCode;

        }
        else {
            errorMessage.Message = errors;
            errorMessage.StatusCode=errors.StatusCode;
        }

        return errorMessage;
    }
}
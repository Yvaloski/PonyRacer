import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from './user.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  const currentUser = userService.currentUser();

  if (currentUser && currentUser.token) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${currentUser.token}`);
    const clonedReq = req.clone({ headers });
    return next(clonedReq);
  }

  return next(req);
};

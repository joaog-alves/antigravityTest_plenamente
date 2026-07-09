import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const savedUser = localStorage.getItem('plenamente_session');
  let token = '';

  if (savedUser) {
    const session = JSON.parse(savedUser);
    token = session.token;
  }

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};

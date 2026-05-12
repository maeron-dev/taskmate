import { HttpInterceptorFn } from '@angular/common/http';

export const versionInterceptor: HttpInterceptorFn = (req, next) => {
  const modifiedReq = req.clone({
    headers: req.headers.set('X-App-Version', '1.0.0')
  });
  return next(modifiedReq);
};

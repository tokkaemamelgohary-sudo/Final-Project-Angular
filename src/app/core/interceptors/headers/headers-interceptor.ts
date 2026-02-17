import { HttpInterceptorFn } from '@angular/common/http';
import { STORED_KEYS } from '../../constants/storedKeys';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {


const plat_Id = inject(PLATFORM_ID)

if(isPlatformBrowser(plat_Id)){
  
  const token = localStorage.getItem(STORED_KEYS.userToken);

if(token) {
if(req.url.includes('cart') || req.url.includes('orders')  )  {
  req =  req.clone({
  setHeaders: {
    token: token

  },
});
}

}
}


  return next(req);
};



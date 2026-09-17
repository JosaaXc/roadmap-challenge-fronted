import { HttpInterceptorFn } from '@angular/common/http';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  let deviceId = localStorage.getItem('deviceId');
  if(!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem('deviceId', deviceId);
  }

  const lat = localStorage.getItem('geo-lat') || '0';
  const long = localStorage.getItem('geo-long') || '0';

  const userAgent = window.navigator.userAgent;
  let os = 'Web';
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac')) os = 'Mac';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';

  const modifiedReq = req.clone({
    setHeaders: {
      'x-device-id': deviceId,
      'x-app-version': '1.0.0',
      'x-latitude': lat,
      'x-longitude': long,
      'x-device-os': os
    }
  });

  console.log('Interceptor ejecutado. Headers inyectados:', modifiedReq.headers.keys());
  return next(modifiedReq);
};

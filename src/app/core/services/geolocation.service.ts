import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  captureAndStoreLocation(): Promise<void>{
    return new Promise((resolve) => {
      if(!navigator.geolocation) {
        resolve();
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          localStorage.setItem('geo-lat', position.coords.latitude.toString());
          localStorage.setItem('geo-lng', position.coords.longitude.toString());
          resolve();
        },
        () => resolve(),
        {timeout: 3000}
      );
    });
  }
}

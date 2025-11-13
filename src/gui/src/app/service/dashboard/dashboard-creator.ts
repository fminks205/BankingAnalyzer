import { Injectable } from '@angular/core';
import { DefaultService } from '../../client/openapi';

@Injectable({
  providedIn: 'root'
})
export class DashboardCreator {
  constructor(
    private client: DefaultService
  ){

  }

  createDashboard(){
    this.client.dashboardDashboardGet()
      .subscribe(html => {
          const blob = new Blob([html], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
        });
  }
}

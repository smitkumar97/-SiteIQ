import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiBaseUrl}/reports`;

  constructor(private http: HttpClient) {}

  generateReport(url: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate`, { url });
  }

  getReportHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history`);
  }
}

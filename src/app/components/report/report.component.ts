import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  standalone: false
})
export class ReportComponent implements OnInit {
  url: string = '';
  reportData: any = null;
  loading: boolean = false;
  history: any[] = [];

  constructor(
    private reportService: ReportService,
    private sanitizer: DomSanitizer
  ) {}

  reportForm = new FormGroup({
    website: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.fetchHistory();
  }

  generateReport() {
    const url = this.reportForm.controls['website'].value || '';
    if (!url.trim()) return;
    this.loading = true;

    this.reportService.generateReport(url).subscribe(
      (data) => {
        this.reportData = data;
        this.fetchHistory();
        this.loading = false;
      },
      (error) => {
        console.error('Error generating report:', error);
        this.loading = false;
      }
    );
  }

  fetchHistory() {
    this.reportService.getReportHistory().subscribe((data) => {
      this.history = data;
    });
  }

  viewReport(item: any) {
    this.reportData = item;
  }

  // Parse recommendations from the API response
  getPerformanceRecommendations(): SafeHtml {
    if (!this.reportData?.recommendations) return '';
    return this.sanitizer.bypassSecurityTrustHtml(
      this.extractSection(this.reportData.recommendations, 'Performance')
    );
  }

  getAccessibilityRecommendations(): SafeHtml {
    if (!this.reportData?.recommendations) return '';
    return this.sanitizer.bypassSecurityTrustHtml(
      this.extractSection(this.reportData.recommendations, 'Accessibility')
    );
  }

  getBestPracticesRecommendations(): SafeHtml {
    if (!this.reportData?.recommendations) return '';
    return this.sanitizer.bypassSecurityTrustHtml(
      this.extractSection(this.reportData.recommendations, 'Best Practices')
    );
  }

  private extractSection(text: string, sectionName: string): string {
    const sectionRegex = new RegExp(`\\*\\*${sectionName}:\\*\\*([\\s\\S]*?)(\\*\\*|$)`, 'i');
    const match = text.match(sectionRegex);

    if (!match) return '<p>No specific recommendations found for this category.</p>';

    return match[1]
      .split('* ')
      .filter(item => item.trim())
      .map(item => `<li>${item.replace(/\n/g, '').trim()}</li>`)
      .join('');
  }
}

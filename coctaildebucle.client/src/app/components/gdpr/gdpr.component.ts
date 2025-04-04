import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { GdprService } from '../../services/gdpr.service';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-gdpr-banner',
  templateUrl: './gdpr.component.html',
  styleUrls: ['./gdpr.component.css'],
  imports: [NgIf],
  standalone: true
})
export class GdprBannerComponent implements OnInit, OnChanges
{
  @Input() showBanner: boolean = true; 

  userId: number | null = null;
  consentGiven: boolean = false;

  @Output() consentChanged = new EventEmitter<boolean>();
  constructor(private gdprService: GdprService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId(); // ✅ Get the logged-in user's ID
    if (this.userId) {
      this.gdprService.getConsent(this.userId).subscribe(
        (response) => {
          this.consentGiven = response.gdprConsent;
          this.showBanner = !this.consentGiven;
          this.consentChanged.emit(this.consentGiven);
        },
        (error) => {
          console.error('Error fetching GDPR consent:', error);
          this.showBanner = true;
          this.consentChanged.emit(false);
        }
      );
    }
    else
    {
      // If no userId is available, assume no consent given
      this.showBanner = true;
      this.consentChanged.emit(false);  // Emit false to indicate no consent
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showBanner']) {
      console.log('showBanner has changed:', this.showBanner);
    }
  }

  giveConsent(): void
  {
    if (this.userId) {
      this.gdprService.giveConsent(this.userId).subscribe({
        next: () => {
          this.consentGiven = true;
          this.showBanner = false;
          this.consentChanged.emit(true);  // Notify parent component
          console.log("Consent given and saved to backend");
          window.location.reload();
        },
        error: (err) => {
          console.error("Error saving consent:", err);
        }
      });
    } else {
      console.warn("User ID is missing, cannot save consent");
    }
  }

  withdrawConsent(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.gdprService.updateConsent(userId, false).subscribe({
        next: () => {
          this.consentChanged.emit(false);  // Notify parent
          console.log("Consent withdrawn");
        },
        error: (error) => {
          console.error("Error withdrawing consent:", error);
        }
      });
    } else {
      console.error("Cannot withdraw consent - userId is null");
    }
  }
}

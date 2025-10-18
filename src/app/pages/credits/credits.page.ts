import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonButton, IonIcon, IonButtons, IonBackButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, person, school, calendar, code } from 'ionicons/icons';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.page.html',
  styleUrls: ['./credits.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader,
    IonCardTitle, IonCardContent, IonButton, IonIcon, IonButtons, IonBackButton,
    CommonModule
  ]
})
export class CreditsPage implements OnInit {
  developer = {
    name: 'Matías Uribe',
    institution: 'AIEP',
    year: new Date().getFullYear(),
    version: '1.0.0'
  };

  technologies = [
    'Ionic 8',
    'Angular',
    'Capacitor 7',
    'SQLite',
    'TypeScript'
  ];

  constructor(private router: Router) {
    addIcons({ arrowBack, person, school, calendar, code });
  }

  ngOnInit() {
  }

  goBack() {
    this.router.navigate(['/tasks-list']);
  }
}

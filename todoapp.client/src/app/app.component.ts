import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LanguageService} from "./Core/Services/Language.Service";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  constructor(private languageService: LanguageService) {}
    ngOnInit(): void {
      // @ts-ignore
      this.languageService.setLanguageBasedOnPreference();
    }
}


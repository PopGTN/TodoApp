import {Component, inject} from '@angular/core';
import {RouterOutlet, TitleStrategy} from "@angular/router";
import {TitleStrategyService} from "../../Core/Services/TitleStrategy.Service";
import {NavbarComponent} from "../fragaments/navbar/navbar.component";

/**
 * @author Joshua Mckenna
 * @since 3/7/2024
 *
 * @description This page will hold the Navbar and handle routing as well for the main app
 * So basiclly page that will have the same footer and navbar as the reset of the app will be
 * child components of this One
 */
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent
  ],

})
export class MainComponent {

}

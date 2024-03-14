import {Component, ElementRef, inject} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {TitleStrategyService} from "../../../Core/Services/TitleStrategy.Service";
import {Title} from "@angular/platform-browser";
import {document} from "ngx-bootstrap/utils";
import {setOffsetToUTC} from "ngx-bootstrap/chronos/units/offset";
import {isEmpty} from "rxjs";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
})
export class NavbarComponent {

  titleService = inject(TitleStrategyService);

  constructor(private elementRef: ElementRef,) {

  }


  /*
  The Code below checks what route that its at and if its not at the root
  route it will remove the class active from the home button.

  This is a fix to where root is consider to be always open because root is set
  to MainComponent and Main Component is a part to all the pages on the site except
   for the 404 page.
  */

  /*Todo: Find a better solution. Need to ask someone for help*/
  ngDoCheck() {
    //Gets path
    var currentRoute = window.location.pathname;
    console.log("Current Route:", currentRoute);
    /*   Checks if path is at the root
         */
    if (currentRoute != "/"){
      console.log('User is not at root')
      document.getElementById('indexBtn').classList.remove("active")
    } else {
      console.log("Is at root")
      document.getElementById('indexBtn').classList.add("active")

    }
  }

  protected readonly document = document;
}

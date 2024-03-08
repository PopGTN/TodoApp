import { Injectable } from "@angular/core";
import { RouterStateSnapshot, TitleStrategy} from "@angular/router";
import {Title} from "@angular/platform-browser";


@Injectable({providedIn: 'root'})
export class TitleStrategyService extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }
  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(`Todo Application | ${title}`);
    }
  }

  public getTitle (){
   return this.title.getTitle();
  }
}

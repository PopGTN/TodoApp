import { Injectable } from "@angular/core";
import { RouterStateSnapshot, TitleStrategy} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {EMPTY, isEmpty} from "rxjs";


@Injectable({providedIn: 'root'})
export class TitleStrategyService extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }


  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    let temptitle:string;

    if (title !== undefined ) {
      temptitle = `BigTodos | ${title}`;
    } else {
      temptitle = "BigTodos";
    }
    this.title.setTitle(cleanTitle(temptitle));
  }
  public getTitle():string {
    return this.title.getTitle();
  }
}


function cleanTitle(str:string) {
  const firstPipeIndex = str.indexOf('|');
  if (firstPipeIndex === -1 || firstPipeIndex === str.length - 1) {
    return str;
  }
  const afterFirstPipe = str.substring(firstPipeIndex + 1);
  if (afterFirstPipe.trim() === '') {
    return str.substring(0, firstPipeIndex);
  } else {
    return str;
  }
}

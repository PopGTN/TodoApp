import {getCurrentDate} from "../util/UtilTools";
interface  TodoItemDTO {
   id: number;
   title: string;
   description: string;
   isComplete: boolean;
   dateTime: string;
}
export class TodoItem  {

  id: number;
  title: string;
  description: string;
  isComplete: boolean;
  dateTime: string;

  constructor(id: number, title: string, description: string, dateTime?: string, isComplete?: boolean) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.isComplete = isComplete == undefined ? false: isComplete;
    this.dateTime = dateTime == undefined ? getCurrentDate() : dateTime;
  }

  toString() {
    return `ID: ${this.id}, Title: ${this.title}, Description: ${this.description}, Complete: ${this.isComplete}, DateTime: ${this.dateTime}`;
  }
}

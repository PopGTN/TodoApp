import {getCurrentDate} from "../util/UtilTools";

interface TodoItemDTO {
  id: number;
  title: string;
  description: string;
  isComplete: boolean;
  dateTime: string;
}

export class TodoItem {

  id: number;
  title: string;
  description: string;
  isComplete: boolean;
  dateTime: string;


  constructor(id?: number, title?: string, description?: string, dateTime?: string, isComplete?: boolean) {
    this.id = id === undefined ? -1 : id;
    this.title = title === undefined ? "" : title;
    this.description = description === undefined ? "" : description;
    this.isComplete = isComplete === undefined ? false : isComplete;
    this.dateTime = dateTime === undefined ? "": dateTime;
  }
   areEqual(item: TodoItem): boolean {
    // Compare properties of the items to check for equality
    return this.id === item.id &&
      this.title === item.title &&
      this.description === item.description &&
      this.dateTime === item.dateTime &&
      this.isComplete === item.isComplete;
  }
  toString() {
    return `ID: ${this.id}, Title: ${this.title}, Description: ${this.description}, Complete: ${this.isComplete}, DateTime: ${this.dateTime}`;
  }
}

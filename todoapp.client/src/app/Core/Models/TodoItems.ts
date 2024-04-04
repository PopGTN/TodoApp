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
    this.dateTime = dateTime === undefined ? "" : dateTime;
  }

  toString() {
    return `ID: ${this.id}, Title: ${this.title}, Description: ${this.description}, Complete: ${this.isComplete}, DateTime: ${this.dateTime}`;
  }
}

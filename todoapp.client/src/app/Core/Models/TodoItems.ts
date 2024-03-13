export class TodoItem {
  private id: bigint;
  private title: string;
  private description: string;
  private isComplete: boolean;
  private dateTime: string;

  constructor(id: any, title: string, description: string, isComplete: boolean, dateTime: string) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.isComplete = isComplete;
    this.dateTime = dateTime;
  }
  toString() {
    return `ID: ${this.id}, Title: ${this.title}, Description: ${this.description}, Complete: ${this.isComplete}, DateTime: ${this.dateTime}`;
  }
}

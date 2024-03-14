export class TodoItem {

  private _id: bigint;
  private _title: string;
  private _description: string;
  private _isComplete: boolean;
  private _dateTime: string;

  constructor(id: any, title: string, description: string, isComplete: boolean, dateTime: string) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._isComplete = isComplete;
    this._dateTime = dateTime;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }
  get dateTime(): string {
    return this._dateTime;
  }

  set dateTime(value: string) {
    this._dateTime = value;
  }
  get isComplete(): boolean {
    return this._isComplete;
  }

  set isComplete(value: boolean) {
    this._isComplete = value;
  }
  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }
  get id(): bigint {
    return this._id;
  }

  set id(value: bigint) {
    this._id = value;
  }
  toString() {
    return `ID: ${this._id}, Title: ${this._title}, Description: ${this._description}, Complete: ${this._isComplete}, DateTime: ${this._dateTime}`;
  }
}

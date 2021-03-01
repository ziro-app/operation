import { Method } from 'axios'
declare interface IFirebaseData {
  origin: 'firebase' | 'api' | 'sheets' | 'zoop' | 'auth';
  method: 'delete' | 'update';
  collection: string;
  field: string;
  identifier: string;
  fieldUpdated?: string;
  valueUpdated?: any;
}

declare interface IZoopData {
  origin: 'firebase' | 'api' | 'sheets' | 'zoop' | 'auth';
  zoopId: string;
}

declare interface ISheetsData {
  origin: 'firebase' | 'api' | 'sheets' | 'zoop' | 'auth';
  id: string;
  rangeToSearch: string;
  rangeToUpdate: string;
  spreadsheetId: string;
  values: Array<string>;
}

declare interface IUserData {
  origin: 'firebase' | 'api' | 'sheets' | 'zoop' | 'auth';
  pass: string;
}

declare interface IApiData {
  origin: 'firebase' | 'api' | 'sheets' | 'zoop' | 'auth';
  url: string;
  method: Method;
  headers: object;
  data?: object;
}

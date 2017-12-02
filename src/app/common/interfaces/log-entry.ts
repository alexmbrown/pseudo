export interface LogEntry {
  timestamp: Date;
  req: {
    method: 'GET' | 'POST' | 'PATCH' | 'PUT';
    path: string;
    headers: any;
    query: any;
    body: any;
    cookies: any;
  };
  res: {
    status: number,
    body: any
  };
}

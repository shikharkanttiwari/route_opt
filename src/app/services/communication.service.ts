import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  constructor(private http: HttpClient) {}

  getOptimizationResults(requestData: any): Observable<any> {
    const apiUrl = 'https://c7nv9mqrt7.execute-api.ap-south-1.amazonaws.com/default/ClaudeOptimization';
    
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Headers', 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token');
      headers.set('Access-Control-Allow-Methods', 'OPTIONS,POST,GET');
      headers.set('Accept',"application/json, text/plain, */*")

    // Using a properly typed version of request
    return this.http.request<any>('POST', apiUrl, {
      headers: headers,
      body: requestData
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Mission {
  id: number;
  titre: string;
  description: string;
  prix: number;
  localisation: string;
  employer?: { id: number; email: string; nom: string; prenom: string; telephone?: string; adresse?: string };
  candidatures?: Array<{ user: { id: number } }>;
  categories?: Array<{ label: string }>;
}



@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private apiUrl = environment.apiUrl + '/missions';

  constructor(private http: HttpClient) {}

  getMissions(): Observable<Mission[]> {
    return this.http.get<Mission[]>(this.apiUrl);
  }

  getMission(id: number): Observable<Mission> {
    return this.http.get<Mission>(`${this.apiUrl}/${id}`);
  }

  apply(missionId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${missionId}/apply`, {});
  }  
  
  cancelApply(missionId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${missionId}/apply`);
  }
  
  updateMission(missionId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${missionId}`, data);
  }
  
  deleteMission(missionId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${missionId}`);
  }
  
  viewCandidates(missionId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${missionId}/candidates`);
  }
  
  acceptCandidate(missionId: number, candidateId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${missionId}/candidates/${candidateId}/accept`, {});
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MissionStatus } from '../../utils/mission-status'; 

export interface Candidature {
  id: number;
  dateSoumission: string;
  dateDecision: string;
  user: {
    id: number;
    nom: string;
    prenom: string;
    email?: string;
  };
  statutCandidature: {
    label: string;
  };
}

export interface Mission {
  id: number;
  titre: string;
  description: string;
  prix: number;
  localisation: string;
  latitude: number;
  longitude: number;
  employer?: {
    id: number;
    nom: string;
    prenom: string;
    email?: string;
    telephone?: string;
    adresse?: string;
  };
  worker?: {
    id: number;
    nom: string;
    prenom: string;
    email?: string;
  };
  categories?: Array<{
    id: number;
    label: string;
  }>;
  statutMission?: {
    label: string;
  };
  candidatures?: Candidature[];
}

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private apiUrl = environment.apiUrl + '/missions';
  private workerSelectedSubject = new Subject<number>();
  workerSelected$ = this.workerSelectedSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialiser l'observable
  }

  initWorkerSelectedObservable() {
    // Cette méthode est appelée pour s'assurer que l'observable est initialisé
  }

  notifyWorkerSelected(missionId: number) {
    this.workerSelectedSubject.next(missionId);
  }

  getMissions(): Observable<Mission[]> {
    return this.http.get<Mission[]>(this.apiUrl);
  }

  getMission(id: number): Observable<Mission> {
    return this.http.get<Mission>(`${this.apiUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
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

  finishMission(missionId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${missionId}`, {
      statutMission: MissionStatus.TERMINATED
    });
  }

  acceptCandidate(missionId: number, candidateId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${missionId}/candidates/${candidateId}/accept`, {}).pipe(
      tap(() => {
        this.notifyWorkerSelected(missionId);
      })
    );
  }
}

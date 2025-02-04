import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Mission {
  id: number;
  titre: string;
  description: string;
  prix: number;
  localisation: string;
  // Vous pouvez ajouter d'autres propriétés si nécessaire
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
}

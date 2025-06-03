import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MissionService } from '../../../services/mission/mission.service';
import { CategoryService, Category } from '../../../services/category/category.service';
import { CommonModule } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzInputModule } from 'ng-zorro-antd/input';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-mission-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzModalModule, NzSelectModule, NzAutocompleteModule, NzInputModule],
  templateUrl: './mission-create.component.html',
  styleUrls: ['./mission-create.component.css']
})
export class MissionCreateComponent implements OnInit, AfterViewInit {
  createForm!: FormGroup;
  categories: Category[] = [];
  addressSuggestions: any[] = [];
  map!: L.Map;
  marker!: L.Marker;
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private missionService: MissionService,
    private categoryService: CategoryService,
    private modalRef: NzModalRef,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png'
    });
    this.createForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      prix: [0, [Validators.required, Validators.min(0)]],
      localisation: ['', Validators.required],
      latitude: [null],
      longitude: [null],
      categories: [[], Validators.required]
    });
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
    this.createForm.get('localisation')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(value => this.http.get(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`))
    ).subscribe((results: any) => {
      this.addressSuggestions = results;
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement).setView([48.8566, 2.3522], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map);
      }
      this.createForm.patchValue({ latitude: lat, longitude: lng });
    });
  }

  selectSuggestion(suggestion: any): void {
    this.createForm.patchValue({
      localisation: suggestion.display_name,
      latitude: suggestion.lat,
      longitude: suggestion.lon
    });
    if (this.marker) {
      this.marker.setLatLng([suggestion.lat, suggestion.lon]);
    } else {
      this.marker = L.marker([suggestion.lat, suggestion.lon]).addTo(this.map);
    }
    this.map.setView([suggestion.lat, suggestion.lon], 13);
    this.addressSuggestions = [];
  }

  submit(): void {
    console.log("Submit triggered", this.createForm.value);
    if (this.createForm.valid) {
      let formData = this.createForm.value;
      formData.coordinates = { lat: formData.latitude, lng: formData.longitude };
      delete formData.latitude;
      delete formData.longitude;
      this.missionService.create(formData).subscribe(response => {
        this.message.success('Mission créée.');
        this.modalRef.close(response);
      }, error => {
        this.message.error('Erreur lors de la création.');
      });
    } else {
      this.message.error('Formulaire invalide');
    }
  }

  cancel(): void {
    this.modalRef.close();
  }
}

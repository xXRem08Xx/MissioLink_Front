import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MissionService } from '../../../services/mission/mission.service';
import { CategoryService, Category } from '../../../services/category/category.service';
import { NzModalRef, NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-mission-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzModalModule, NzSelectModule],
  templateUrl: './mission-create.component.html',
  styleUrls: ['./mission-create.component.css']
})
export class MissionCreateComponent implements OnInit {
  createForm!: FormGroup;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private missionService: MissionService,
    private categoryService: CategoryService,
    private modalRef: NzModalRef,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    // Création du formGroup avec un contrôle pour les catégories (initialisé à un tableau vide)
    this.createForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      prix: [0, [Validators.required, Validators.min(0)]],
      adresse: ['', Validators.required],
      categories: [[], Validators.required]
    });
    // Récupération des catégories depuis le service
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  submit(): void {
    if (this.createForm.valid) {
      const formData = this.createForm.value;
      console.log('Formulaire soumis : ', formData);
      this.missionService.create(formData).subscribe(response => {
        this.message.success('Mission créée.');
        this.modalRef.close(response);
      }, error => {
        this.message.error('Erreur lors de la création.');
      });
    }
  }

  cancel(): void {
    this.modalRef.close();
  }
}

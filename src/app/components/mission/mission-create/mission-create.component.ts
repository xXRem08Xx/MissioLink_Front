import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MissionService } from '../../../services/mission/mission.service';
import { CategoryService, Category } from '../../../services/category/category.service';
import { NzModalRef, NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mission-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzModalModule, NzSelectModule, FormsModule],
  templateUrl: './mission-create.component.html',
  styleUrls: ['./mission-create.component.css'] 
})
export class MissionCreateComponent implements OnInit {
  createForm!: FormGroup;
  categories: Category[] = [];
  selectedCategories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private missionService: MissionService,
    private categoryService: CategoryService,
    private modalRef: NzModalRef,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.createForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      prix: [0, [Validators.required, Validators.min(0)]],
      adresse: ['', Validators.required]
    });
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  submit(): void {
    if (this.createForm.valid) {
      const formData = this.createForm.value;
      formData.categories = this.selectedCategories.map(cat => cat.id);
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

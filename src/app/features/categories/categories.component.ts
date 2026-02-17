import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CategorieaService } from '../../core/services/categories/categoriea.service';
import { Categories } from '../../core/models/categories/categories.interface';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {

  
  private readonly categorieaService = inject(CategorieaService);

  categoriesList: WritableSignal<Categories[]> = signal<Categories[]>([]);

  ngOnInit(): void {
    this.getAllCategoriesData();
  }

  getAllCategoriesData(): void {
    this.categorieaService.getAllCategories().subscribe({
      next: (res) => {
        this.categoriesList.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

}

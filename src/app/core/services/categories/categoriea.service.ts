import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { CategoriesResponse } from '../../models/categories/categories.interface';

@Injectable({
  providedIn: 'root',
})
export class CategorieaService {
  
private readonly httpClient = inject(HttpClient);

getAllCategories():Observable<CategoriesResponse>{
  return this.httpClient.get<CategoriesResponse>(environment.base_url + 'categories')
}
}

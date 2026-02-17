import { Component, inject, signal, WritableSignal } from '@angular/core';
import { NgxPaginationModule, PaginationInstance } from 'ngx-pagination';
import { Product } from '../../core/services/products/product.interface';
import { ProductsService } from '../../core/services/products/products.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { SearchPipe } from '../../shared/pipes/search-pipe';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-products',
  imports: [CardComponent, NgxPaginationModule, SearchPipe, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {

  private readonly productsService = inject(ProductsService);

  productList: WritableSignal<Product[]> = signal<Product[]>([]);


  pagination: PaginationInstance = {
    id: 'products',
    itemsPerPage: 40,
    currentPage: 1,
    totalItems: 0,
  };


  text:string = ''


  ngOnInit(): void {
    this.getAllProductsData();
  }



getAllProductsData():void{
  this.productsService.getAllProducts(this.pagination.currentPage , this.pagination.itemsPerPage).subscribe({
      next: (res) => {
        this.productList.set(res.data);
        this.pagination.totalItems = res.results;
      },
      error: (err) => {
        console.log(err);
      },
    });
}


pageChanged(page:number): void{
this.pagination.currentPage = page;
this.getAllProductsData();
}


}

import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductDatialsService } from '../products/services/product-details/product-datials.service';
import { ActivatedRoute } from '@angular/router';
import { ProductDetails } from '../products/models/product-details/product-details.interface';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit{
private readonly productDatialsService= inject(ProductDatialsService);
private readonly activatedRoute = inject(ActivatedRoute);


productId:string|null = null;

productDetailsData:WritableSignal<ProductDetails> = signal<ProductDetails>({} as ProductDetails)



ngOnInit(): void {
this.getProductId();
this.getSpecificProductData();
}


 getProductId():void{
  this.activatedRoute.paramMap.subscribe({
    next: (urlParams)=>{
      this.productId = urlParams.get('id');
    },
  });
 }


getSpecificProductData():void{
   this.productDatialsService.getSpecificProduct(this.productId).subscribe({
next: (res)=>{
  this.productDetailsData.set(res.data);
},
 
error:(err)=>{
  console.log(err);
},
  });
}


}

import { TestBed } from '@angular/core/testing';

import { ProductDatialsService } from './product-datials.service';

describe('ProductDatialsService', () => {
  let service: ProductDatialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductDatialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

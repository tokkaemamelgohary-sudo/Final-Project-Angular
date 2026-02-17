import { TestBed } from '@angular/core/testing';

import { CategorieaService } from './categoriea.service';

describe('CategorieaService', () => {
  let service: CategorieaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategorieaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

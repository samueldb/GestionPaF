import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelleFamilleListComponent } from './parcelle-famille-list.component';

describe('ParcelleFamilleListComponent', () => {
  let component: ParcelleFamilleListComponent;
  let fixture: ComponentFixture<ParcelleFamilleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParcelleFamilleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcelleFamilleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

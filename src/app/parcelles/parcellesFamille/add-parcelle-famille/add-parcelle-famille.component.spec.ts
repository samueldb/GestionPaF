import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddParcelleFamilleComponent } from './add-parcelle-famille.component';

describe('AddParcelleFamilleComponent', () => {
  let component: AddParcelleFamilleComponent;
  let fixture: ComponentFixture<AddParcelleFamilleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddParcelleFamilleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddParcelleFamilleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

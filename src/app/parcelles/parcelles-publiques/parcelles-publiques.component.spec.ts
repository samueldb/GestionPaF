import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcellesPubliquesComponent } from './parcelles-publiques.component';

describe('ParcellesPubliquesComponent', () => {
  let component: ParcellesPubliquesComponent;
  let fixture: ComponentFixture<ParcellesPubliquesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParcellesPubliquesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcellesPubliquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

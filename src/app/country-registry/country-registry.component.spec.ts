import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryRegistryComponent } from './country-registry.component';

describe('CountryRegistryComponent', () => {
  let component: CountryRegistryComponent;
  let fixture: ComponentFixture<CountryRegistryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountryRegistryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

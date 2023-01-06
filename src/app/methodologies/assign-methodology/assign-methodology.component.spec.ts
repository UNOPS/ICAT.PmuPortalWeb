import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignMethodologyComponent } from './assign-methodology.component';

describe('AssignMethodologyComponent', () => {
  let component: AssignMethodologyComponent;
  let fixture: ComponentFixture<AssignMethodologyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignMethodologyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignMethodologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

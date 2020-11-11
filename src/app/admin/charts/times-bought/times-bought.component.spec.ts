import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesBoughtComponent } from './times-bought.component';

describe('TimesBoughtComponent', () => {
  let component: TimesBoughtComponent;
  let fixture: ComponentFixture<TimesBoughtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimesBoughtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesBoughtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

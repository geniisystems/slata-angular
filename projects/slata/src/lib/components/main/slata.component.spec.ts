import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlataComponent } from './slata.component';

describe('SlataComponent', () => {
  let component: SlataComponent;
  let fixture: ComponentFixture<SlataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

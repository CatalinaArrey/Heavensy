import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Secretary } from './secretary';

describe('Secretary', () => {
  let component: Secretary;
  let fixture: ComponentFixture<Secretary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Secretary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Secretary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

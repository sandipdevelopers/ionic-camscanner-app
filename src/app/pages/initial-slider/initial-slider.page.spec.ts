import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InitialSliderPage } from './initial-slider.page';

describe('InitialSliderPage', () => {
  let component: InitialSliderPage;
  let fixture: ComponentFixture<InitialSliderPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialSliderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

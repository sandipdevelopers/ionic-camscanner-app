import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OCRPage } from './ocr.page';

describe('OCRPage', () => {
  let component: OCRPage;
  let fixture: ComponentFixture<OCRPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OCRPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

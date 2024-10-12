import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageToPdfPage } from './image-to-pdf.page';

describe('ImageToPdfPage', () => {
  let component: ImageToPdfPage;
  let fixture: ComponentFixture<ImageToPdfPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageToPdfPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

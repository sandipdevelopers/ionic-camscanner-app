import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListingDocPage } from './listing-doc.page';

describe('ListingDocPage', () => {
  let component: ListingDocPage;
  let fixture: ComponentFixture<ListingDocPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingDocPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

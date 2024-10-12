import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ICardPage } from './i-card.page';

describe('ICardPage', () => {
  let component: ICardPage;
  let fixture: ComponentFixture<ICardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ICardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

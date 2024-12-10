import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteIdeasPageComponent } from './favorite-ideas-page.component';

describe('FavoriteIdeasPageComponent', () => {
  let component: FavoriteIdeasPageComponent;
  let fixture: ComponentFixture<FavoriteIdeasPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteIdeasPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteIdeasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

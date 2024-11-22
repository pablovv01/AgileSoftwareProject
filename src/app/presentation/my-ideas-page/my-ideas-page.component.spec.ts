import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyIdeasPageComponent } from './my-ideas-page.component';

describe('MyIdeasPageComponent', () => {
  let component: MyIdeasPageComponent;
  let fixture: ComponentFixture<MyIdeasPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyIdeasPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyIdeasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

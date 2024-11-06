import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIdeaComponent } from './add-idea.component';

describe('AddIdeaComponent', () => {
  let component: AddIdeaComponent;
  let fixture: ComponentFixture<AddIdeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddIdeaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

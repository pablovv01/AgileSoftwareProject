import { ComponentFixture, TestBed } from '@angular/core/testing';
import { addIdeaComponent } from './add-idea.component';

describe('AddIdeaComponent', () => {
  let component: addIdeaComponent;
  let fixture: ComponentFixture<addIdeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [addIdeaComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(addIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
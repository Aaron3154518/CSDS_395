import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommenderComponent } from './recommender.component';

describe('RecommenderComponent', () => {
  let component: RecommenderComponent;
  let fixture: ComponentFixture<RecommenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommenderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

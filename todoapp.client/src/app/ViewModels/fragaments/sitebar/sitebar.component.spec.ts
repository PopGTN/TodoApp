import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitebarComponent } from './sitebar.component';

describe('SitebarComponent', () => {
  let component: SitebarComponent;
  let fixture: ComponentFixture<SitebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SitebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SitebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

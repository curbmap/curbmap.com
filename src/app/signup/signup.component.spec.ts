import { TestBed } from '@angular/core/testing';

import { SignupComponent } from './signup.component';

describe('Signup Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [SignupComponent]});
  });

  it('should ...', () => {
    const fixture = TestBed.createComponent(SignupComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.children[0].textContent).toContain('Signup Works!');
  });

});

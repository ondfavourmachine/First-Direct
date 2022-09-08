import { async, ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<< HEAD:src/app/core/shared/confirmation/confirmation.component.spec.ts
import { ConfirmationComponent } from './confirmation.component';

describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationComponent ]
=======
import { SecretComponent } from './secret.component';

describe('SecretComponent', () => {
  let component: SecretComponent;
  let fixture: ComponentFixture<SecretComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecretComponent ]
>>>>>>> 32ca9d7b1f470e4cf9f74a17de892434cb1ea45b:src/app/pages/auth/secret/secret.component.spec.ts
    })
    .compileComponents();
  }));

  beforeEach(() => {
<<<<<<< HEAD:src/app/core/shared/confirmation/confirmation.component.spec.ts
    fixture = TestBed.createComponent(ConfirmationComponent);
=======
    fixture = TestBed.createComponent(SecretComponent);
>>>>>>> 32ca9d7b1f470e4cf9f74a17de892434cb1ea45b:src/app/pages/auth/secret/secret.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

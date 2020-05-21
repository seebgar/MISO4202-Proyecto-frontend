import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { HttpClientModule } from '@angular/common/http';
import { NbToastrService, NbDialogService } from '@nebular/theme';



import { OrdenesDeCompraComponent } from './ordenesdecompra.component';

describe('OrdenesDeCompraComponent', () => {
  let component: OrdenesDeCompraComponent;
  let fixture: ComponentFixture<OrdenesDeCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenesDeCompraComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, NbToastrService, NbDialogService],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenesDeCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

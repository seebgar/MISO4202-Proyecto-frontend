import { TestBed } from "@angular/core/testing";

import { MainService } from "./main.service";
import { HttpClientModule } from "@angular/common/http";

describe("MainServiceService", () => {
  let service: MainService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(MainService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

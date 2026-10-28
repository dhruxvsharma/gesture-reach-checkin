import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { cn } from "../src/lib/utils.ts";

describe("Utility functions", () => {
  it("cn merges class names properly", () => {
    const isHidden = false;
    const result = cn("base-class", isHidden && "ignored", "active-class");
    assert.equal(result, "base-class active-class");
  });

  it("cn handles tailwind conflicts correctly", () => {
    const result = cn("p-4", "p-8");
    assert.equal(result, "p-8");
  });
});

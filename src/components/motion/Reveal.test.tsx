import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Reveal } from "./Reveal";

describe("Reveal", () => {
  it("renders its children", () => {
    render(
      <Reveal>
        <p>Contenido animado</p>
      </Reveal>
    );
    expect(screen.getByText("Contenido animado")).toBeInTheDocument();
  });
});

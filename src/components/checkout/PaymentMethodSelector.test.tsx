import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PaymentMethodSelector } from "./PaymentMethodSelector";

describe("PaymentMethodSelector", () => {
  it("renders both payment methods", () => {
    render(
      <PaymentMethodSelector
        selected="STRIPE"
        onSelect={() => {}}
        contraentregaAvailable
      />
    );
    expect(screen.getByText(/tarjeta/i)).toBeInTheDocument();
    expect(screen.getByText(/contra entrega/i)).toBeInTheDocument();
  });

  it("disables contraentrega for non-wholesale carts with an explanation", () => {
    render(
      <PaymentMethodSelector
        selected="STRIPE"
        onSelect={() => {}}
        contraentregaAvailable={false}
      />
    );
    const codButton = screen.getByRole("button", { name: /contra entrega/i });
    expect(codButton).toBeDisabled();
    expect(screen.getByText(/cajas de 12/i)).toBeInTheDocument();
  });

  it("selects contraentrega when available", () => {
    const onSelect = vi.fn();
    render(
      <PaymentMethodSelector
        selected="STRIPE"
        onSelect={onSelect}
        contraentregaAvailable
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /contra entrega/i }));
    expect(onSelect).toHaveBeenCalledWith("CONTRAENTREGA");
  });

  it("selects stripe", () => {
    const onSelect = vi.fn();
    render(
      <PaymentMethodSelector
        selected="CONTRAENTREGA"
        onSelect={onSelect}
        contraentregaAvailable
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /tarjeta/i }));
    expect(onSelect).toHaveBeenCalledWith("STRIPE");
  });

  it("shows no explanation when contraentrega is available", () => {
    render(
      <PaymentMethodSelector
        selected="STRIPE"
        onSelect={() => {}}
        contraentregaAvailable
      />
    );
    expect(
      screen.queryByText(/cajas de 12/i)
    ).not.toBeInTheDocument();
  });

  it("stripe button is never disabled even when contraentrega is unavailable", () => {
    render(
      <PaymentMethodSelector
        selected="STRIPE"
        onSelect={() => {}}
        contraentregaAvailable={false}
      />
    );
    const stripeButton = screen.getByRole("button", { name: /tarjeta/i });
    expect(stripeButton).not.toBeDisabled();
  });
});

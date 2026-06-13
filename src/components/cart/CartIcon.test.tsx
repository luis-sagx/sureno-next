import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartIcon } from "./CartIcon";
import { useCartStore } from "@/store/cart";

// Reset store before each test
beforeEach(() => {
  useCartStore.setState({ items: [], isOpen: false });
});

describe("CartIcon", () => {
  it("renders a cart button with accessible label", () => {
    render(<CartIcon />);

    const button = screen.getByRole("button", { name: /carrito/i });
    expect(button).toBeInTheDocument();
  });

  it("does not show badge when cart is empty", () => {
    render(<CartIcon />);

    // Badge is hidden when totalItems === 0 — good UX pattern
    expect(screen.queryByText("0")).toBeNull();
  });

  it("shows totalItems count in the badge", () => {
    useCartStore.getState().addItem({
      variantId: "v1",
      productId: "p1",
      productName: "Test Product",
      productSlug: "test-product",
      variantLabel: "750ml",
      unitPrice: 100,
      type: "RETAIL",
      imageUrl: null,
      quantity: 3,
    });

    render(<CartIcon />);

    // Badge should show 3
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("opens the cart drawer on click when cart is closed", () => {
    render(<CartIcon />);

    const button = screen.getByRole("button", { name: /carrito/i });
    fireEvent.click(button);

    expect(useCartStore.getState().isOpen).toBe(true);
  });

  it("closes the cart drawer on click when cart is open", () => {
    useCartStore.setState({ isOpen: true });

    render(<CartIcon />);

    const button = screen.getByRole("button", { name: /carrito/i });
    fireEvent.click(button);

    expect(useCartStore.getState().isOpen).toBe(false);
  });
});

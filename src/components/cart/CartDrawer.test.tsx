import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartDrawer } from "./CartDrawer";
import { useCartStore } from "@/store/cart";

beforeEach(() => {
  useCartStore.setState({ items: [], isOpen: false });
});

describe("CartDrawer", () => {
  it("renders nothing when isOpen is false", () => {
    const { container } = render(<CartDrawer />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the drawer when isOpen is true", () => {
    useCartStore.setState({ isOpen: true });
    render(<CartDrawer />);

    expect(screen.getByText("Tu Carrito")).toBeInTheDocument();
  });

  it("shows empty state when cart has no items", () => {
    useCartStore.setState({ isOpen: true });
    render(<CartDrawer />);

    expect(screen.getByText("Tu carrito está vacío")).toBeInTheDocument();
  });

  it("closes the drawer when close button is clicked", () => {
    useCartStore.setState({ isOpen: true });
    render(<CartDrawer />);

    const closeButton = screen.getByRole("button", { name: /cerrar/i });
    fireEvent.click(closeButton);

    expect(useCartStore.getState().isOpen).toBe(false);
  });

  it("closes the drawer when clicking the backdrop", () => {
    useCartStore.setState({ isOpen: true });
    render(<CartDrawer />);

    const backdrop = screen.getByTestId("cart-backdrop");
    fireEvent.click(backdrop);

    expect(useCartStore.getState().isOpen).toBe(false);
  });

  it("shows cart items with product names and variant labels", () => {
    useCartStore.setState({
      isOpen: true,
      items: [
        {
          variantId: "v1",
          productId: "p1",
          productName: "Ron Pampero Aniversario",
          productSlug: "ron-pampero",
          variantLabel: "750ml",
          quantity: 2,
          unitPrice: 850,
          type: "RETAIL",
          imageUrl: null,
        },
      ],
    });

    render(<CartDrawer />);

    expect(
      screen.getByText("Ron Pampero Aniversario")
    ).toBeInTheDocument();
    expect(screen.getByText("750ml")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("shows type badge for retail items as 'Retail'", () => {
    useCartStore.setState({
      isOpen: true,
      items: [
        {
          variantId: "v1",
          productId: "p1",
          productName: "Test Product",
          productSlug: "test",
          variantLabel: "750ml",
          quantity: 1,
          unitPrice: 100,
          type: "RETAIL",
          imageUrl: null,
        },
      ],
    });

    render(<CartDrawer />);

    expect(screen.getByText("Retail")).toBeInTheDocument();
  });

  it("shows type badge for wholesale items as 'Mayoreo'", () => {
    useCartStore.setState({
      isOpen: true,
      items: [
        {
          variantId: "v1",
          productId: "p1",
          productName: "Test Product",
          productSlug: "test",
          variantLabel: "Caja 12",
          quantity: 6,
          unitPrice: 500,
          type: "WHOLESALE",
          imageUrl: null,
        },
      ],
    });

    render(<CartDrawer />);

    expect(screen.getByText("Mayoreo")).toBeInTheDocument();
  });

  it("shows checkout link when cart has items", () => {
    useCartStore.setState({
      isOpen: true,
      items: [
        {
          variantId: "v1",
          productId: "p1",
          productName: "Test Product",
          productSlug: "test",
          variantLabel: "750ml",
          quantity: 1,
          unitPrice: 100,
          type: "RETAIL",
          imageUrl: null,
        },
      ],
    });

    render(<CartDrawer />);

    expect(
      screen.getByRole("link", { name: /ir al checkout/i })
    ).toBeInTheDocument();
  });

  it("shows empty state link to catalog when cart is empty", () => {
    useCartStore.setState({ isOpen: true });
    render(<CartDrawer />);

    const catalogLink = screen.getByRole("link", { name: /catálogo/i });
    expect(catalogLink).toBeInTheDocument();
    expect(catalogLink).toHaveAttribute("href", "/catalog");
  });
});

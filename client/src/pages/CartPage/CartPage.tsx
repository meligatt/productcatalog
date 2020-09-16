import React from "react";
import { Heading, Paragraph, styled, Page } from "fannypack";
import CartList from "../../components/CartList/CartList";
import { useHomePageContext } from "../../pages/HomePage/HomePageContext";
import { Link } from "react-router-dom";

const SendQuoteLink = styled(Link)`
  display: block;
  text-align: right;
  color: #000;
  font-weight: 600;
  font-size: 1.2rem;
  white-space: nowrap;
  padding: 1rem;
  transition: color 0.2s;
  text-decoration: underline;
  border-radius: 4px;
  color: #d32f2f;
  &:hover {
    color: #ff0000;
    text-decoration: underline;
  }
`;

export const CartPage = () => {
  const { cart } = useHomePageContext();

  if (!cart.length) {
    return (
      <Page.Content isFluid breakpoint="desktop">
        <Heading>Mi Cotización:</Heading>
        <Paragraph>No hay Productos en la Cotización.</Paragraph>
        <Paragraph>
          <Link
            style={{ textDecoration: "underline" }}
            to="/categoria/Q2F0ZWdvcnk6Nw=="
          >
            Click aqui para empezar a agregar productos a su cotización.
          </Link>
        </Paragraph>
      </Page.Content>
    );
  }

  return (
    <Page.Content isFluid breakpoint="desktop">
      <Heading>Mi Cotización</Heading>
      {cart.length > 5 && (
        <SendQuoteLink to="/enviar-cotizacion">
          Siguiente paso: Ingrese sus datos
        </SendQuoteLink>
      )}
      <CartList />
      <SendQuoteLink to="/enviar-cotizacion">
        Siguiente paso: Ingrese sus datos
      </SendQuoteLink>
    </Page.Content>
  );
};
export default CartPage;

import React from "react";
import { graphql } from "babel-plugin-relay/macro";
import { createFragmentContainer } from "react-relay";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { CategoryList_categories } from "./__generated__/CategoryList_categories.graphql";

const ProductsList = styled.ul`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 0;
  padding: 0 2rem;
  line-height: 1;
  list-style: none;

  @media (min-width: 760px) {
    margin: 0;
    padding: 0;
    flex-direction: column;
    flex-wrap: nowrap;
  }
`;

const ProductItem = styled.li`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  margin: 0.5rem;
  padding: 0.5rem;
  border: 1px solid grey;
  width: 70%;
  @media (min-width: 760px) {
    display: block;
    padding: 0;
    margin: 0;
    border: none;
    border-radius: 30px;
  }
`;

const ProductsListLink = styled((props) => <Link {...props} />)`
  position: relative;
  padding: 1rem;
  display: block;
  color: #000;
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
  @media (min-width: 425px) {
    font-size: 1.2rem;
    &:hover {
      color: #000;
      background-color: rgba(255, 204, 0, 0.3);
      transition: background-color 0.2s;
      border-radius: 1px;
    }
  }
`;

type CategoryListProps = {
  categories: CategoryList_categories;
};

export const CategoryList: React.FunctionComponent<CategoryListProps> = ({
  categories,
}): JSX.Element => {
  return (
    <ProductsList>
      {categories && categories.edges && categories.edges.length > 0 ? (
        categories.edges.map((item: any) => {
          return (
            <ProductItem key={item.node.id}>
              <ProductsListLink to={`/categoria/${item.node.id}`}>
                {item.node.name}
              </ProductsListLink>
            </ProductItem>
          );
        })
      ) : (
        <ProductItem>No hay categorias</ProductItem>
      )}
    </ProductsList>
  );
};

export default createFragmentContainer(CategoryList, {
  categories: graphql`
    fragment CategoryList_categories on CategoryConnection {
      edges {
        node {
          id
          name
        }
      }
    }
  `,
});

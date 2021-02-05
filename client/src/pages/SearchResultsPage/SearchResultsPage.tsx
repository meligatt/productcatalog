import React from "react";
import { QueryRenderer } from "react-relay";
import { graphql } from "babel-plugin-relay/macro";
import environment from "../../environment";
import { useParams } from "react-router-dom";
import ProductList from "../../components/ProductList/ProductList";
import { Heading, PageContent } from "bumbag";
import Loader from "../../components/Loader/Loader";

export const SearchResultsPage = (): JSX.Element => {
  const { searchTerm } = useParams<{ searchTerm: string }>();

  // TODO: backend needs to update fetchCategories query. https://trello.com/c/GoBJE1mZ
  // FOR NOW, using the searchProducts query to render list of products.
  // this: searchProducts(searchTerm: "categoryName") will be updated with: fetchCategories(categoryID: <theIDFromRouterParams>)

  return (
    <QueryRenderer
      environment={environment}
      query={graphql`
        query SearchResultsPageQuery($searchTerm: String!) {
          searchProducts(searchTerm: $searchTerm) {
            ...ProductList_products
          }
        }
      `}
      variables={{ searchTerm: searchTerm }}
      render={({ error, props }: { error: any; props: any }) => {
        if (error) {
          console.error("error: ", error);
          return <div>Error!</div>;
        }
        if (!props) {
          return <Loader />;
        }

        return (
          <PageContent breakpoint="desktop">
            <Heading use="h2" fontSize="400" paddingBottom="1rem">
              Resultados para: "{searchTerm}"
            </Heading>
            <ProductList products={props.searchProducts} />
          </PageContent>
        );
      }}
    />
  );
};
export default SearchResultsPage;

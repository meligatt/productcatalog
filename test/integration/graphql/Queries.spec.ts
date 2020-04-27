import assert from "assert";

import { createConnection, Connection } from "typeorm";
import { graphql } from "graphql";

import { schema } from "../../../src/graphql";
import { Category } from "../../../src/entity/Category";
import { Product } from "../../../src/entity/Product";
import Email from "../../../src/email";
import { ProductFactory, CategoryFactory } from "../../fixtures/factories";

// Declaring global variables to be able to make a DB connection
// once instead of inside every 'it' function, because 'describe' functions
// can't return promises.
let connection: Connection;
let baseContext;

beforeAll(async () => {
  connection = await createConnection("test");
  baseContext = { entityManager: connection.manager };

  // Make sure the DB is empty
  const categoryCount = await connection
    .createQueryBuilder(Category, "categories")
    .getCount();
  assert(categoryCount === 0);

  const recordCount = 5;

  const categories = CategoryFactory.buildMany(recordCount);
  await connection.manager.save(Category, categories);
  const categoryRecords = await connection.manager.find(Category);

  const products = categoryRecords.flatMap((category: Category) =>
    ProductFactory.buildMany(recordCount, { category })
  );

  await connection.manager.save(products);
});

afterAll(async (done) => {
  await connection.createQueryBuilder().delete().from(Product).execute();
  await connection.createQueryBuilder().delete().from(Category).execute();

  connection.close();
  done();
});

describe("GraphQL schema", () => {
  describe("fetchCategories", () => {
    const query = `
      query {
        fetchCategories {
          edges {
            node {
              name
              products {
                edges {
                  node {
                    name
                  }
                }
              }
            }
          }
        }
      }
    `;

    it("returns category fields", async () => {
      expect.assertions(2);

      const context = { ...baseContext };

      const results = await graphql(schema, query, null, context);
      const categories = results.data.fetchCategories.edges.map(
        (catEdge) => catEdge.node
      );

      expect(categories).toContainEqual(
        expect.objectContaining({ name: expect.any(String) })
      );
      expect(categories).not.toContainEqual(undefined);
    });

    it("returns associated products", async () => {
      expect.assertions(1);

      const context = { ...baseContext };

      const results = await graphql(schema, query, null, context);
      const categories = results.data.fetchCategories.edges.map(
        (catEdge) => catEdge.node
      );

      const products = categories
        .map((cat) => cat.products.edges.map((prodEdge) => prodEdge.node))
        .flat(1);

      expect(products).toContainEqual(
        expect.objectContaining({ name: expect.any(String) })
      );
    });
  });

  describe("searchProducts", () => {
    const query = `
      query($searchTerm: String!) {
        searchProducts(searchTerm: $searchTerm) {
          edges {
            node { name }
          }
        }
      }
    `;

    it("returns any matching products", async () => {
      expect.assertions(1);

      const context = { ...baseContext };

      // Need to create the product in the `it` function, because `describe`
      // callbacks can't be async
      const category = await connection.manager.findOne(Category, 1);

      await connection.manager.save(
        Product,
        ProductFactory.build({
          category: category,
          name: "Guantes de Seguridad",
        })
      );

      const results = await graphql(schema, query, null, context, {
        searchTerm: "guantes",
      });
      const products = results.data.searchProducts.edges.map(
        (prodEdge) => prodEdge.node
      );

      expect(products).toContainEqual(
        expect.objectContaining({ name: expect.stringMatching(/[gG]uantes/) })
      );
    });

    describe("when there are no matching products", () => {
      it("returns an empty array", async () => {
        expect.assertions(1);

        const context = { ...baseContext };

        const results = await graphql(schema, query, null, context, {
          searchTerm: "something that definitely doesn't exist",
        });
        const products = results.data.searchProducts.edges.map(
          (prodEdge) => prodEdge.node
        );

        expect(products.length).toEqual(0);
      });
    });
  });

  describe("sendContactMessage", () => {
    const query = `
      query(
        $personalIdNumber: String!,
        $emailAddress: String!,
        $message: String!,
        $name: String,
        $phoneNumber: String
      ) {
        sendContactMessage(
          personalIdNumber: $personalIdNumber,
          emailAddress: $emailAddress,
          message: $message,
          name: $name,
          phoneNumber: $phoneNumber
        ) {
          status
          message
        }
      }
    `;

    const mockResponse = { status: "success", message: "hooray" };
    const mockSend = jest.fn(async () => mockResponse);
    Email.send = mockSend;

    const variables = {
      personalIdNumber: "13421234",
      emailAddress: "test@test.com",
      message: "I want more info",
      name: "Roberto",
      phoneNumber: "12341234",
    };

    it("sends an email", async () => {
      expect.assertions(1);

      const context = { ...baseContext, sendEmail: Email.send };

      await graphql(schema, query, null, context, variables);
      expect(mockSend.mock.calls.length).toBe(1);
    });

    it("returns response status info", async () => {
      expect.assertions(1);

      const context = { ...baseContext, sendEmail: Email.send };

      const results = await graphql(schema, query, null, context, variables);

      const messageResponse = results.data.sendContactMessage;

      expect(messageResponse).toEqual({
        ...mockResponse,
        status: mockResponse.status.toUpperCase(),
      });
    });
  });
});

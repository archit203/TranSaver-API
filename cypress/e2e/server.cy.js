describe("API testing", () => {

  const username = Math.random().toString(36).slice(2);

  before("registering a user", () => {
    cy.request("POST", "http://localhost:3000/register", {
      username: username,
      password: "testpassword"
    }).then((response) => {
      expect(response.status).to.eq(201);
    });
  });

  before("login a user", () => {
    cy.request("POST", "http://localhost:3000/login", {
      username: username,
      password: "testpassword"
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property("token");
      Cypress.env('token', response.body.token);
    });
  });

  beforeEach(() => {
    // Retrieve the token from Cypress environment variable
    const token = Cypress.env('token');
    expect(token).to.not.be.undefined;

    // Use cy.wrap to ensure token is properly assigned for each test case
    cy.wrap(token).as('token');
  });

  it("Creating transaction", function () {
    // Access token using this.token
    const authToken = "Bearer " + this.token;

    cy.request({
      method: "POST",
      url: "http://localhost:3000/transactions",
      headers: {
        authorization: authToken
      },
      body: {
        income: 1000,
        expenses: 500,
        description: "Test transaction",
        date: "2024-02-20"
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
    });
  });

  it("Getting transaction", function () {
    // Access token using this.token
    const authToken = "Bearer " + this.token;

    cy.request({
      method: "GET",
      url: "http://localhost:3000/transactions",
      headers: {
        authorization: authToken
      },
      qs: {
        start_date: "2024-02-01",
        end_date: "2024-02-28"
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.transactions.length).to.eq(1);
    });
  });

  it("Getting summary", function () {
    // Access token using this.token
    const authToken = "Bearer " + this.token;

    cy.request({
      method: "GET",
      url: "http://localhost:3000/transactions/summary",
      headers: {
        authorization: authToken
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("totalIncome");
      expect(response.body).to.have.property("totalExpenses");
      expect(response.body).to.have.property("totalSavings");
    });
  });

  it("Deleting transaction", function () {
    // Access token using this.token
    const authToken = "Bearer " + this.token;

    cy.request({
      method: "GET",
      url: "http://localhost:3000/transactions/",
      headers: {
        authorization: authToken
      },
      qs: {
        start_date: "2024-02-01",
        end_date: "2024-02-28"
      }
    }).then((response) => {
      const transaction_id = response.body.transactions[0].id;
      cy.request({
        method: "DELETE",
        url: "http://localhost:3000/transactions/" + transaction_id,
        headers: {
          authorization: authToken
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });
});

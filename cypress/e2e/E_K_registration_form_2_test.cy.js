const { faker } = require("@faker-js/faker");

// Variables to generate random data
const username = faker.internet.userName();
const email = faker.internet.email();
const firstName = faker.name.firstName();
const lastName = faker.name.lastName();
const phoneNumber = generateRandomPhoneNumber();
const password = faker.internet.password();
const confirmPassword = password; // For simplicity, making confirmation password same as password

function generateRandomPhoneNumber() {
  const digits = "0123456789";
  let phoneNumber = "";

  for (let i = 0; i < 10; i++) {
    phoneNumber += digits[Math.floor(Math.random() * 10)];
  }
  // Format the phone number as needed
  phoneNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");

  return phoneNumber;
}

// example, how to use function, which fills in all mandatory data
function inputValidData() {
  cy.get('input[data-testid="user"]').type(username);
  cy.get("#email").type(email);
  cy.get('[data-cy="name"]').type(firstName);
  cy.get("#lastName").type(lastName);
  cy.get('[data-testid="phoneNumberTestId"]').type(phoneNumber);
  cy.get("#password").type(password);
  cy.get("#confirm").type(confirmPassword);
  cy.get("h2").contains("Password").click();
}

beforeEach(() => {
  cy.visit("cypress/fixtures/registration_form_2.html");
});

/*
Assignement 4: add content to the following tests
*/

describe("Section 1: Functional tests", () => {
  it("Fulfill all the mandatory fields with function and submit the form", () => {
    inputValidData();
  });

  it("User can use only same both first and validation passwords", () => {
    cy.get("#username").type("Pets123");
    cy.get("#email").type("okokokho@hot.ee");
    cy.get('input[name="name"]').type("Peeter");
    cy.get('input[name="lastName"]').type("Rebane");
    cy.get('input[data-testid="phoneNumberTestId"]').type("56565656");
    cy.get("#password").type("MyPass123");
    cy.get("#confirm").type("MyPass123456");
    cy.get("h2").contains("Password").click();
    cy.get(".submit_button").should("be.disabled");
    cy.get("#success_message").should("not.be.visible");
    cy.get("#password_error_message").should("be.visible");
    cy.get("#password_error_message").should("have.css", "display", "block");
    cy.get("#confirm").scrollIntoView();
    cy.get("#confirm").clear();
    cy.get("#confirm").type("MyPass123");
    cy.get("h2").contains("Password").click();
    cy.get("#password_error_message").should("not.be.visible");
    cy.get("#password_error_message").should("have.css", "display", "none");
    cy.get(".submit_button").should("be.enabled");
  });

  it("User can submit form with all fields added", () => {
    cy.get("#username").type("Pets123");
    cy.get("#email").type("okokokho@hot.ee");
    cy.get('input[name="name"]').type("Peeter");
    cy.get('input[name="lastName"]').type("Rebane");
    cy.get('input[data-testid="phoneNumberTestId"]').type("56565656");
    cy.get("#javascriptFavLanguage").click();
    cy.get("#vehicle1").click();
    cy.get("#vehicle2").click();
    cy.get("#cars").select(3);
    cy.get("#animal").select(5);
    cy.get("#password").type("MyPass123");
    cy.get("#confirm").type("MyPass123");
    cy.get("h2").contains("Password").click();
    cy.get(".submit_button").should("be.enabled");
    cy.get(".submit_button").click();
    cy.get("#success_message").should("be.visible");
  });

  it("User can submit form with valid data and only mandatory fields added", () => {
    cy.get("#username").type("Pets123");
    cy.get("#email").type("rokokoko123@hot.ee");
    cy.get('input[name="name"]').type("Peeter");
    cy.get('input[name="lastName"]').type("Rebane");
    cy.get('input[data-testid="phoneNumberTestId"]').type("56565656");
    cy.get("h2").contains("Password").click();
    cy.get(".submit_button").should("be.enabled");
    cy.get(".submit_button").click();
    cy.get(".submit_button").click();
    cy.get("#success_message").should("be.visible");
  });

  it("User cannot submit the form if one or multiple mandatory fields are missing", () => {
    cy.get("#username").type("Pets123");
    cy.get("#email").type("okokokho@hot.ee");
    cy.get('input[name="name"]').type("Peeter");
    cy.get('input[name="lastName"]').clear();
    cy.get('input[data-testid="phoneNumberTestId"]').type("56565656");
    cy.get("h2").contains("Password").click();
    cy.get(".submit_button").should("be.disabled");
    cy.get("#success_message").should("not.be.visible");
  });
});

/*
Assignement 5: create more visual tests
*/

describe("Section 2: Visual tests", () => {
  it("Check that logo is correct and has correct size", () => {
    cy.log("Will check logo source and size");
    cy.get("#logo").should("have.attr", "src").should("include", "cerebrum_hub_logo");
    cy.get("#logo").invoke("height").should("be.lessThan", 178).and("be.greaterThan", 100);
    cy.get("#logo").invoke("width").should("be.lessThan", 180).and("be.greaterThan", 150);
  });

  it("My test for second picture", () => {
    cy.log("Will check second logo source and size");
    cy.get('img[data-cy="cypress_logo"]').should("have.attr", "src").should("include", "cypress_logo");
    cy.get('img[data-cy="cypress_logo"]').invoke("height").should("be.lessThan", 100).and("be.greaterThan", 70);
    cy.get('img[data-cy="cypress_logo"]').invoke("width").should("be.lessThan", 120).and("be.greaterThan", 75);
  });

  it("Check navigation part", () => {
    cy.get("nav").children().should("have.length", 2);
    cy.get("nav").siblings("h1").should("have.text", "Registration form number 2");
    cy.get("nav").children().eq(0).should("be.visible").and("have.attr", "href", "registration_form_1.html").click();
    cy.url().should("contain", "/registration_form_1.html");
    cy.go("back");
    cy.log("Back again in registration form 2");
  });

  it("Check the second link of the navigation", () => {
    cy.get("nav").children().should("have.length", 2);
    cy.get("nav")
      .siblings("div")
      .find("#top")
      .should("have.text", "This is more advanced registration form, some parts are reused from form 1");
    cy.get("nav").children().eq(1).should("be.visible").and("have.attr", "href", "registration_form_3.html").click();
    cy.url().should("contain", "/registration_form_3.html");
    cy.go("back");
    cy.log("Back again in registration form 2");
  });

  it("Check that radio button of web languages list is correct", () => {
    cy.get('input[type="radio"]').should("have.length", 4);

    // Verify labels of the radio buttons
    cy.get('input[type="radio"]').next().eq(0).should("have.text", "HTML");
    cy.get('input[type="radio"]').next().eq(1).should("have.text", "CSS");
    cy.get('input[type="radio"]').next().eq(2).should("have.text", "JavaScript");
    cy.get('input[type="radio"]').next().eq(3).should("have.text", "PHP");

    //Verify default state of radio buttons
    cy.get('input[type="radio"]').eq(0).should("not.be.checked");
    cy.get('input[type="radio"]').eq(1).should("not.be.checked");
    cy.get('input[type="radio"]').eq(2).should("not.be.checked");
    cy.get('input[type="radio"]').eq(3).should("not.be.checked");

    // Selecting one will remove selection from the other radio button
    cy.get('input[type="radio"]').eq(0).check().should("be.checked");
    cy.get('input[type="radio"]').eq(1).check().should("be.checked");
    cy.get('input[type="radio"]').eq(0).should("not.be.checked");
  });

  it("Check that radio button of web languages list is correct", () => {
    cy.get('input[type="checkbox"]').should("have.length", 3);

    cy.get('input[type="checkbox"]').next().eq(0).should("have.text", "I have a bike");
    cy.get('input[type="checkbox"]').next().eq(1).should("have.text", "I have a car");
    cy.get('input[type="checkbox"]').next().eq(2).should("have.text", "I have a boat");

    cy.get('input[type="checkbox"]').eq(0).should("not.be.checked");
    cy.get('input[type="checkbox"]').eq(1).should("not.be.checked");
    cy.get('input[type="checkbox"]').eq(2).should("not.be.checked");

    cy.get('input[type="checkbox"]').eq(0).check().should("be.checked");
    cy.get('input[type="checkbox"]').eq(1).check().should("be.checked");
    cy.get('input[type="checkbox"]').eq(2).check().should("be.checked");

    cy.get('input[type="checkbox"]').eq(0).uncheck().should("not.be.checked");
    cy.get('input[type="checkbox"]').eq(1).uncheck().should("not.be.checked");
  });

  it("Car dropdown is correct", () => {
    cy.get("#cars").children().should("have.length", 4);
    cy.get("#cars").find("option").should("have.length", 4);
    cy.get("#cars").find("option").eq(0).should("have.text", "Volvo");
    cy.get("#cars").find("option").eq(1).should("have.text", "Saab");
    cy.get("#cars").find("option").eq(2).should("have.text", "Opel");
    cy.get("#cars").find("option").eq(3).should("have.text", "Audi");

    // Advanced level how to check the content of the Cars dropdown
    cy.get("#cars")
      .find("option")
      .then((options) => {
        const actual = [...options].map((option) => option.value);
        expect(actual).to.deep.eq(["volvo", "saab", "opel", "audi"]);
      });
  });

  it("Animal dropdown is correct", () => {
    // Next 2 lines of code do exactly the same!
    cy.get("#animal").children().should("have.length", 6);
    cy.get("#animal").find("option").should("have.length", 6);
    cy.get("#animal").find("option").eq(0).should("have.text", "Dog");
    cy.get("#animal").find("option").eq(1).should("have.text", "Cat");
    cy.get("#animal").find("option").eq(2).should("have.text", "Snake");
    cy.get("#animal").find("option").eq(3).should("have.text", "Hippo");
    cy.get("#animal").find("option").eq(4).should("have.text", "Cow");
    cy.get("#animal").find("option").eq(5).should("have.text", "Horse");

    // Advanced level how to check the content of the Cars dropdown
    cy.get("#animal")
      .find("option")
      .then((animals) => {
        const actual = [...animals].map((animal) => animal.value);
        expect(actual).to.deep.eq(["dog", "cat", "snake", "hippo", "cow", "mouse"]);
      });
  });
});

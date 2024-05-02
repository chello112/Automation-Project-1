const { faker } = require("@faker-js/faker");

// Variables to generate random data
const username = faker.internet.userName();
const email = faker.internet.email();
const firstName = faker.name.firstName();
const lastName = faker.name.lastName();
const phoneNumber = generateRandomPhoneNumber();
const password = faker.internet.password();
// For simplicity, making confirmation password same as password
const confirmPassword = password;

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

// 1.//////////////////////////////////////////////////////////////////////
describe("Section 1: Functional tests", () => {
  it("User can use only same both first and validation passwords", () => {
    // Add test steps for filling in only mandatory fields
    cy.get("#username").type("Pets123");
    cy.get("#email").type("okokokho@hot.ee");
    cy.get('input[name="name"]').type("Peeter");
    cy.get('input[name="lastName"]').type("Rebane");
    cy.get('input[data-testid="phoneNumberTestId"]').type("56565656");
    // Type confirmation password which is different from first password
    cy.get("#password").type("MyPass123");
    cy.get("#confirm").type("MyPass123456");
    // Assert that submit button is not enabled
    cy.get("h2").contains("Password").click();
    cy.get(".submit_button").should("be.disabled");
    // Assert that successful message is not visible
    cy.get("#success_message").should("not.be.visible");
    // Assert that error message is visible
    cy.get("#password_error_message").should("be.visible");
    cy.get("#password_error_message").should("have.css", "display", "block");
    // Change the test, so the passwords would match
    cy.get("#confirm").scrollIntoView();
    cy.get("#confirm").clear();
    cy.get("#confirm").type("MyPass123");
    cy.get("h2").contains("Password").click();
    // Add assertion, that error message is not visible anymore
    cy.get("#password_error_message").should("not.be.visible");
    cy.get("#password_error_message").should("have.css", "display", "none");
    // Add assertion, that submit button is now enabled
    cy.get(".submit_button").should("be.enabled");
  });

  // 2./////////////////////////////////////////////////////////////////////
  it("User can submit form with all fields added", () => {
    // Add test steps for filling in ALL fields
    cy.get("#username").type("Pets123");
    cy.get("#email").type("okokokho@hot.ee");
    cy.get('input[name="name"]').type("Peeter");
    cy.get('input[name="lastName"]').type("Rebane");
    cy.get('input[data-testid="phoneNumberTestId"]').type("56565656");
    // Assert that one or multiple of your favorite Web language radio buttons are selected
    cy.get("#javascriptFavLanguage").click();
    // Assert that one or multiple of your favorite transport radio buttons are selected
    cy.get("#vehicle1").click();
    cy.get("#vehicle2").click();
    // Assert that one car brand is selected from the cars dropdown list
    cy.get("#cars").select(3);
    // Assert that one favourite animal is selected from the animals dropdown list
    cy.get("#animal").select(5);
    // Assert that the same password and confirmation password are entered into input section
    cy.get("#password").type("MyPass123");
    cy.get("#confirm").type("MyPass123");
    cy.get("h2").contains("Password").click();
    // Assert that submit button is enabled
    cy.get(".submit_button").should("be.enabled");
    // Assert that after submitting the form system show successful message
    cy.get(".submit_button").click();
    cy.get("#success_message").should("be.visible");
  });

  // 3./////////////////////////////////////////////////////////////////////////////
  it("User can submit form with valid data and only mandatory fields added", () => {
    // Add test steps for filling in ONLY mandatory fields
    cy.get("#username").type("Pets123");
    cy.get("#email").type("rokokoko123@hot.ee");
    cy.get('input[name="name"]').type("Peeter");
    cy.get('input[name="lastName"]').type("Rebane");
    cy.get('input[data-testid="phoneNumberTestId"]').type("56565656");
    cy.get("h2").contains("Password").click();
    // Assert that submit button is enabled
    cy.get(".submit_button").should("be.enabled");
    cy.get(".submit_button").click();
    // Assert that after submitting the form system shows successful message
    cy.get(".submit_button").click();
    cy.get("#success_message").should("be.visible");
  });
});

it.only("Fulfill all the mandatory fields with function and submit the form", () => {
  // Add test steps for filling in ONLY mandatory fields, using a function
  inputValidData();
});

// 4./////////////////////////////////////////////////////////////////////////////
// Add at least 1 test for checking some mandatory field's absence
it("User cannot submit the form if one or multiple mandatory fields are missing", () => {
  // Assert that one mandatory field will be absent from the mandatory fields
  cy.get("#username").type("Pets123");
  cy.get("#email").type("okokokho@hot.ee");
  cy.get('input[name="name"]').type("Peeter");
  // Last name is missing => cy.get('input[name="lastName"]').type("Rebane");
  cy.get('input[data-testid="phoneNumberTestId"]').type("56565656");
  cy.get("h2").contains("Password").click();
  // Assert that submit button is disabled
  cy.get(".submit_button").should("be.disabled");
  // Assert that successful message is not visible
  cy.get("#success_message").should("not.be.visible");
});

/*
Assignement 5: create more visual tests
*/

// 2.///////////////////////////////////////////////////////////////////////////////////////
describe("Section 2: Visual tests", () => {
  it("Check that logo is correct and has correct size", () => {
    cy.log("Will check logo source and size");
    cy.get("#logo").should("have.attr", "src").should("include", "cerebrum_hub_logo");
    // Get element and check its parameter height and width
    // Height should be less than 178 and greater than 100
    cy.get("#logo").invoke("height").should("be.lessThan", 178).and("be.greaterThan", 100);
    // width should be less than 180 and greater than 150
    cy.get("#logo").invoke("width").should("be.lessThan", 180).and("be.greaterThan", 150);
  });

  it("My test for second picture", () => {
    cy.log("Will check second logo source and size");
    cy.get('img[data-cy="cypress_logo"]').should("have.attr", "src").should("include", "cypress_logo");
    // Get element and check its parameter height and width
    // Height should be less than 100 and greater than 70
    cy.get('img[data-cy="cypress_logo"]').invoke("height").should("be.lessThan", 100).and("be.greaterThan", 70);
    // width should be less than 120 and greater than 75
    cy.get('img[data-cy="cypress_logo"]').invoke("width").should("be.lessThan", 120).and("be.greaterThan", 75);
  });

  // 3.//////////////////////////////////////////////////////////////////////////////////////
  it("Check navigation part", () => {
    cy.get("nav").children().should("have.length", 2);

    // Get navigation element, find siblings that contains h1 and check if it has Registration form in string
    cy.get("nav").siblings("h1").should("have.text", "Registration form number 2");
    // Get navigation element, find its first child, check the link content and click it
    cy.get("nav").children().eq(0).should("be.visible").and("have.attr", "href", "registration_form_1.html").click();
    // Check that currently opened URL is correct
    cy.url().should("contain", "/registration_form_1.html");
    // Go back to previous page
    cy.go("back");
    cy.log("Back again in registration form 2");
  });

  // Create similar test for checking the second link
  it("Check the second link of the navigation", () => {
    cy.get("nav").children().should("have.length", 2);
    {
      /* Get navigation element, find siblings that contains p inside div element and check
  if it has text: "This is more advanced registration form, some parts are reused from form 1"    */
    }
    cy.get("nav")
      .siblings("div")
      .find("#top")
      .should("have.text", "This is more advanced registration form, some parts are reused from form 1");
    // Get navigation element, find its first child, check the link content and click it
    cy.get("nav").children().eq(1).should("be.visible").and("have.attr", "href", "registration_form_3.html").click();
    // Check that currently opened URL is correct
    cy.url().should("contain", "/registration_form_3.html");
    // Go back to previous page
    cy.go("back");
    cy.log("Back again in registration form 2");
  });

  it("Check that radio button of web languages list is correct", () => {
    // Array of found elements with given selector has 4 elements in total
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

  // Create test similar to previous one verifying check boxes
  it("Check that radio button of web languages list is correct", () => {
    // Array of found elements with given selector has 3 elements in total
    cy.get('input[type="checkbox"]').should("have.length", 3);
    // Verify labels of the checkboxes
    cy.get('input[type="checkbox"]').next().eq(0).should("have.text", "I have a bike");
    cy.get('input[type="checkbox"]').next().eq(1).should("have.text", "I have a car");
    cy.get('input[type="checkbox"]').next().eq(2).should("have.text", "I have a boat");
    //Verify default state of checkboxes
    cy.get('input[type="checkbox"]').eq(0).should("not.be.checked");
    cy.get('input[type="checkbox"]').eq(1).should("not.be.checked");
    cy.get('input[type="checkbox"]').eq(2).should("not.be.checked");
    // Verify that it is possible to select multiple checkboxes
    cy.get('input[type="checkbox"]').eq(0).check().should("be.checked");
    cy.get('input[type="checkbox"]').eq(1).check().should("be.checked");
    cy.get('input[type="checkbox"]').eq(2).check().should("be.checked");
    // Verify that it is possible to deselect checkboxes
    cy.get('input[type="checkbox"]').eq(0).uncheck().should("not.be.checked");
    cy.get('input[type="checkbox"]').eq(1).uncheck().should("not.be.checked");
  });

  it("Car dropdown is correct", () => {
    // Here is just an example how to explicitely create screenshot from the code
    // Select second element and create screenshot for this area or full page
    /* cy.get("#cars").select(1).screenshot("Cars drop-down");
    cy.screenshot("Full page screenshot"); */

    // Here are given different solutions how to get the length of array of elements in Cars dropdown
    // Next 2 lines of code do exactly the same!
    cy.get("#cars").children().should("have.length", 4);
    cy.get("#cars").find("option").should("have.length", 4);

    // Check  that first element in the dropdown has text Volvo
    cy.get("#cars").find("option").eq(0).should("have.text", "Volvo");
    // Check  that second element in the dropdown has text Saab
    cy.get("#cars").find("option").eq(1).should("have.text", "Saab");
    // Check  that third element in the dropdown has text Opel
    cy.get("#cars").find("option").eq(2).should("have.text", "Opel");
    // Check  that fourth element in the dropdown has text Audi
    cy.get("#cars").find("option").eq(3).should("have.text", "Audi");

    // Advanced level how to check the content of the Cars dropdown
    cy.get("#cars")
      .find("option")
      .then((options) => {
        const actual = [...options].map((option) => option.value);
        expect(actual).to.deep.eq(["volvo", "saab", "opel", "audi"]);
      });
  });

  // Create test similar to previous one
  it.only("Animal dropdown is correct", () => {
    // Here are given different solutions how to get the length of array of elements in Animals dropdown
    // Next 2 lines of code do exactly the same!
    cy.get("#animal").children().should("have.length", 6);
    cy.get("#animal").find("option").should("have.length", 6);
    // Check that the first element in the dropdown has text Dog
    cy.get("#animal").find("option").eq(0).should("have.text", "Dog");
    // Check that the second element in the dropdown has text Cat
    cy.get("#animal").find("option").eq(1).should("have.text", "Cat");
    // Check that the third element in the dropdown has text Snake
    cy.get("#animal").find("option").eq(2).should("have.text", "Snake");
    // Check that the fourth element in the dropdown has text Hippo
    cy.get("#animal").find("option").eq(3).should("have.text", "Hippo");
    // Check that the fifth element in the dropdown has text Cow
    cy.get("#animal").find("option").eq(4).should("have.text", "Cow");
    // Check that the sixth element in the dropdown has text Horse
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

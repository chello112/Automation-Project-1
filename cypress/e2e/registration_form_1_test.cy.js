// Before each test (it...) open .html page
beforeEach(() => {
  cy.visit("cypress/fixtures/registration_form_1.html");
});

/*
Assignment 2:

 1. Update the name of test suite by adding your name: “This is first test suite, John Smith”
 2. Replace text ‘MyPass123’ in the first test with your own chosen password (2 places) - passwords should match
 3. Change phone number in the first test to 555666777
 4. Change the order of steps in the first test:
      -first set phone number
      -then 2 password fields
      -then username
 5. Add comment to the first test containing today’s date
 */

// 2.///////////////////////////////////////////////////////////////////////////////////
describe("This is first test suite, Egert Kriisa", () => {
  it("User can submit data only when valid mandatory values are added", () => {
    cy.get('[data-testid="phoneNumberTestId"]').type("555666777");
    cy.get("#firstName").type("Mesi");
    cy.get("#lastName").type("Kapp");
    cy.get('input[name="password"]').type("MyPass123");
    cy.get('[name="confirm"]').type("MyPass123");
    cy.get("#username").type("Johnny");

    // In order to activate submit button, user has to click somewhere outside the input field
    cy.get("h2").contains("Password").click();
    cy.get(".submit_button").should("be.enabled");
    cy.get(".submit_button").click();

    // Assert that both input and password error messages are not shown
    // next 2 lines check exactly the same, but using different approach
    cy.get("#input_error_message").should("not.be.visible");
    cy.get("#password_error_message").should("have.css", "display", "none");

    // Assert that success message is visible
    // next 2 lines check exactly the same, but using different approach
    cy.get("#success_message").should("be.visible");
    cy.get("#success_message").should("have.css", "display", "block");
  });

  // 3.///////////////////////////////////////////////////////////////////////////////////
  it("User cannot submit data when phone number is absent", () => {
    cy.get("#firstName").type("Mesi");
    cy.get("#lastName").type("Kapp");
    cy.get('input[name="password"]').type("MyPass123");
    cy.get('[name="confirm"]').type("MyPass123");
    cy.get("#username").type("Johnny");

    // Scroll back to phone number input field
    cy.get('[data-testid="phoneNumberTestId"]').scrollIntoView();
    cy.get('[data-testid="phoneNumberTestId"]').clear();
    cy.get("h2").contains("Password").click();

    // Asserting that Submit button is disabled
    cy.get(".submit_button").should("be.disabled");

    // Assert that success message is not visible
    cy.get("#success_message").should("not.be.visible");
  });

  // 4.//////////////////////////////////////////////////////////////////////////////////////
  it("User cannot submit data when password and/or confirmation password is absent", () => {
    cy.get("#username").type("Johnny");
    cy.get("#firstName").type("Mesi");
    cy.get("#lastName").type("Kapp");
    cy.get('[data-testid="phoneNumberTestId"]').type("555666777");
    cy.get('input[name="password"]').type("MyPass123");
    cy.get('[name="confirm"]').type("MyPass123");

    // Scroll back to password input field
    cy.get('input[name="password"]').scrollIntoView();
    cy.get('input[name="password"]').clear();
    cy.get("h2").contains("Password").click();

    // Asserting that Submit button is disabled
    cy.get(".submit_button").should("be.disabled");

    // Assert that success message is not visible
    cy.get("#success_message").should("not.be.visible");
  });

  // 5./////////////////////////////////////////////////////////////////////////////////
  it("User cannot add letters to phone number", () => {
    cy.get("#username").type("Johnny");
    cy.get("#firstName").type("Mesi");
    cy.get("#lastName").type("Kapp");
    cy.get('input[name="password"]').type("MyPass123");
    cy.get('[name="confirm"]').type("MyPass123");

    // How we can check from html code, that phone number should contain only numbers
    cy.get('[data-testid="phoneNumberTestId"]').should("have.attr", "type", "number");

    // Try typing letters to phone number field
    cy.get('[data-testid="phoneNumberTestId"]').type("Cerebrum Hub");

    // Assert that submit button is not enabled and that successful message is not visible
    cy.get("h2").contains("Password").click();
    cy.get(".submit_button").should("be.disabled");
    cy.get("#success_message").should("not.be.visible");
  });

  // 24.04.2024///////////////////////////////////////////////////////////////////////////////////
  it("User cannot submit data when username is absent", () => {
    cy.get("#username").type("johnDoe");
    cy.get('[data-testid="phoneNumberTestId"]').type("10203040");
    cy.get("input[name='password']").type("MyPass123");
    cy.get('[name="confirm"]').type("MyPass123");

    // Scroll back to username input field
    cy.get("#username").scrollIntoView();
    cy.get("#username").clear();
    cy.get("h2").contains("Password").click();

    // Asserting that Submit button is disabled
    cy.get(".submit_button").should("be.disabled");

    // Assert that success message is not visible
    cy.get("#success_message").should("not.be.visible");

    // Assert that correct error message is visible and contain given text
    cy.get("#input_error_message")
      .should("be.visible")
      .should("contain", "Mandatory input field is not valid or empty!");

    // Assert that username has tooltip with error message
    cy.get('input[name="username"]').should("have.attr", "title").should("contain", "Input field");

    // There are 2 options how to check error message visibility: using CSS or simply be.visible
    // none = not visible; block = visible
    cy.get("#input_error_message").should("be.visible");
    cy.get("#input_error_message").should("have.css", "display", "block");
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////
  it("User can use only same both first and validation passwords", () => {
    cy.get("#username").type("johnDoe");
    cy.get('[data-testid="phoneNumberTestId"]').type("10203040");
    cy.get('input[name="password"]').type("MyPass123");
    cy.get('[name="confirm"]').type("MyPass123123");

    // type('{enter}') is clicking native enter button from the keyboard
    // for example, to click backspace use '{backspace}'
    cy.get('[name="confirm"]').type("{enter}");

    // Scroll to bottom of the page
    cy.window().scrollTo("bottom");

    // Assert that password error message is visible, and message should contain 'Passwords do not match!
    cy.get("#password_error_message").should("be.visible").should("contain", "Passwords do not match!");
    // Assert that success message is not visible
    cy.get("#success_message").should("not.be.visible");
    // Asserting that Submit button is disabled
    cy.get(".submit_button").should("be.disabled");
    // Assert that password confirmation input fields has attribute 'title' with text stating 'Both passwords should match'
    cy.get('input[name="confirm"]').should("have.attr", "title", "Both passwords should match");
  });
});

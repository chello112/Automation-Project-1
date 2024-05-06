const { faker } = require("@faker-js/faker");

beforeEach(() => {
  cy.visit("cypress/fixtures/registration_form_3.html");
});

/*
BONUS TASK: add visual tests for registration form 3
Task list:
* Create test suite for visual tests for registration form 3 (describe block)
* Create tests to verify visual parts of the page:
    * radio buttons and its content
    * dropdown and dependencies between 2 dropdowns:
        * list of cities changes depending on the choice of country
        * if city is already chosen and country is updated, then city choice should be removed
    * checkboxes, their content and links
    * email format
 */

/*
BONUS TASK: add functional tests for registration form 3
Task list:
* Create second test suite for functional tests
* Create tests to verify logic of the page:
    * all fields are filled in + corresponding assertions
    * only mandatory fields are filled in + corresponding assertions
    * mandatory fields are absent + corresponding assertions (try using function)
    * add file functionality(google yourself for solution!)
 */
describe("Second section: Functional tests", () => {
  it("User can submit form with all fields", () => {
    fillAllFields();
    formSubmission();
  });

  it("User can submit form with only mandatory fields", () => {
    fillMandatoryFields();
    formSubmission();
  });

  it("User is adding only optional fields", () => {
    fillOptionalFields();
  });

  it("File functionality", () => {
    uploadFile("cerebrum_hub_logo.png");
  });
});

// Define a function to fill all fields in the form
function fillAllFields() {
  writeRandomName();
  writeRandomEmail();
  selectRandomCountryAndCity("#country", "#city");
  currentDateOfRegistration();
  selectRandomRadioButton();
  setRandomDateInDatepicker();
  selectPrivacyPolicyCheckbox();
  selectCookiePolicyCheckbox();
  uploadFile("cerebrum_hub_logo.png");
}

// Define a function to fill only mandatory fields of the form
function fillMandatoryFields() {
  writeRandomName();
  writeRandomEmail();
  selectRandomCountryAndCity("#country", "#city");
  selectPrivacyPolicyCheckbox();
}

// Define a function to fill only optional fields of the form
function fillOptionalFields() {
  currentDateOfRegistration();
  selectRandomRadioButton();
  setRandomDateInDatepicker();
  selectCookiePolicyCheckbox();
  uploadFile("cerebrum_hub_logo.png");
}

// Variables
const testName = faker.name.firstName();
const testEmail = faker.internet.email();

// Function to fulfill name input section
function writeRandomName() {
  cy.get("#name").type(testName);
  // Assert that name field is mandatory
  cy.get("#name").should("have.attr", "required");
}

// Function to fulfill email input section
function writeRandomEmail() {
  cy.get('[name="email"]').type(testEmail);
  // Assert that email field is mandatory
  cy.get('[name="email"]').should("have.attr", "required");
}

// Funtion that selects random country and city from the dropdown list
function selectRandomCountryAndCity(countryDropdownSelector, cityDropdownSelector) {
  // Select random country
  cy.get(countryDropdownSelector).then((countryDropdown) => {
    const countryOptions = countryDropdown.find("option").not(":first-child:empty");
    const randomCountryIndex = Math.floor(Math.random() * countryOptions.length);
    const randomCountryValue = countryOptions[randomCountryIndex].value;
    cy.get(countryDropdownSelector).select(randomCountryValue);
    // Assert that the country dropdown has options
    cy.get("#country").should("not.have.value", "");

    // Wait for city dropdown to be populated based on selected country
    cy.get(cityDropdownSelector).should("not.be.disabled");

    // Select random city from the city dropdown
    cy.get(cityDropdownSelector).then(($cityDropdown) => {
      const cityOptions = $cityDropdown.find("option").not(":first-child:empty");
      const randomCityIndex = Math.floor(Math.random() * cityOptions.length);
      const randomCityValue = cityOptions[randomCityIndex].value;
      cy.get(cityDropdownSelector).select(randomCityValue);
      // Assert that the city dropdown has options after selecting a country
      cy.get("#city").should("not.have.value", "");
    });
  });
}

// Function to select current date of registration
function currentDateOfRegistration() {
  // Get current date
  const today = new Date();
  const year = today.getFullYear();
  // JavaScript months are 0-based, so add 1 to get the correct month
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const currentDate = `${year}-${month}-${day}`;
  // Locate the datepicker input field and input the current date
  cy.get("label").contains("Date of registration").siblings("input").click().type(currentDate);
}

// Function to select a random radio button
function selectRandomRadioButton() {
  // Select all radio buttons
  cy.get("label")
    .contains("Select the frequency of receiving our newsletter:")
    .siblings("input")
    .then((radios) => {
      // Get a random index
      const randomIndex = Math.floor(Math.random() * radios.length);
      // Get the randomly selected radio button
      const randomRadio = radios[randomIndex];
      // Click on the randomly selected radio button
      cy.wrap(randomRadio).click();
      // Assert that only one radio button is checked
      cy.get('input[type="radio"]').filter(":checked").should("have.length", 1);
    });
}

// Function to generate random date from the year 1900 until now
function generateRandomDate() {
  // Get today's date
  const today = new Date();
  // Set the maximum date as today
  const maxDate = today.getTime();
  // Set the minimum date as January 1, 1900
  const minDate = new Date("1900-01-01").getTime();
  // Generate a random timestamp between the minimum and maximum dates
  const randomTimestamp = Math.floor(Math.random() * (maxDate - minDate + 1)) + minDate;
  // Convert the timestamp to a Date object
  const randomDate = new Date(randomTimestamp);
  return randomDate;
}

// Function to pick random date and make correct formatting
function setRandomDateInDatepicker() {
  // Click on the datepicker input field to open the datepicker
  cy.get("#birthday").click();
  // Get the random date
  const randomDate = generateRandomDate();
  // Format the random date
  const year = randomDate.getFullYear();
  const month = String(randomDate.getMonth() + 1).padStart(2, "0");
  const day = String(randomDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  // Set the formatted random date in the datepicker input field
  cy.get("#birthday").clear().type(formattedDate);
}

// Function to check the first checkbox(privacy policy)
function selectPrivacyPolicyCheckbox() {
  cy.get('input[type="checkbox"][ng-model="checkbox"]').first().check();
}

// Function to check the second checkbox(cookie policy)
function selectCookiePolicyCheckbox() {
  cy.get('input[type="checkbox"]').eq(1).check(); // Check the second checkbox
}

// Define a function to upload a file
function uploadFile(fileName) {
  cy.fixture(fileName).then((fileContent) => {
    cy.get('input[type="file"]').then((input) => {
      const el = input[0];
      const testFile = new File([fileContent], fileName);
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(testFile);
      el.files = dataTransfer.files;
      cy.wrap(input).trigger("change", { force: true });
    });
  });
}

// Function for clicking submit button
function formSubmission() {
  // Assert that submit button is enabled
  cy.get('[type="submit"]').should("not.have.attr", "disabled");
  // Submitting the form
  cy.get('[type="submit"]').eq(1).click();
  // Check that currently opened page URL is correct
  cy.url().should("contain", "http://localhost:61715/cypress/fixtures/");
}

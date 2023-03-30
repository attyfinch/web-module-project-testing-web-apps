import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';
import DisplayComponent from './DisplayComponent'

test('renders without errors', () => {
    render(<ContactForm />)
});

test('renders the contact form header', () => {
// the header h1 element exists. Include three asserts, if the header is in the document, if the heads is truthy, if the header has the correct test content.
    render(<ContactForm />)
    const header = screen.getByText(/contact form/i)
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent('Contact Form')
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    
    // Arrange
    render(<ContactForm />)
    const shortName = 'Raj'
    const errorMessage = "Error: firstName must have at least 5 characters."

    // Act
    const nameInput = screen.getByLabelText(/first name/i);
    userEvent.type(nameInput, shortName);

    // Assert
    await waitFor(() => {
        const errorMessageAppears = screen.queryByText(errorMessage)
        expect(errorMessageAppears).toBeInTheDocument();
    })
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    // Arrange
    render(<ContactForm />)
    const firstNameError = "Error: firstName must have at least 5 characters."
    const lastNameError = 'Error: lastName is a required field.'
    const emailError = 'Error: email must be a valid email address.'

    // Act
    const submit = screen.getByRole('button');
    userEvent.click(submit);

    // Assert
    const firstNameErrorAppears = screen.queryByText(firstNameError);
    expect(firstNameErrorAppears).toBeInTheDocument();

    const lastNameErrorAppears = screen.queryByText(lastNameError);
    expect(lastNameErrorAppears).toBeInTheDocument();

    const emailErrorAppears = screen.queryByText(emailError);
    expect(emailErrorAppears).toBeInTheDocument();

});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    // Arrange
    render(<ContactForm />)
    const firstName = "Bradley"
    const lastName = "Morris"
    const firstNameError = "Error: firstName must have at least 5 characters."
    const lastNameError = 'Error: lastName is a required field.'
    const emailError = 'Error: email must be a valid email address.'
    const firstInput = screen.getByLabelText(/first name/i);
    const lastInput = screen.getByLabelText(/last name/i);
    const button = screen.getByRole('button');

    // Act
    userEvent.type(firstInput, firstName)
    userEvent.type(firstInput, firstName)
    userEvent.click(button)

    // Assert
    await waitFor(() => {
        const firstNameErrorAppears = screen.queryByText(firstName)
        expect(firstNameErrorAppears).toBeFalsy();
        
        const lastNameErrorAppears = screen.queryByText(lastName)
        expect(lastNameErrorAppears).toBeFalsy(); 

        const emailErrorAppears = screen.queryByText(emailError)
        expect(emailErrorAppears).toBeInTheDocument();
    })

});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    // Arrange
    render(<ContactForm />)
    const invalidEmail = "abcd"
    const emailError = 'Error: email must be a valid email address.'
    const emailInput = screen.getByLabelText(/email/i);

    // Act
    userEvent.type(emailInput, invalidEmail);
    
    // Assert
    await waitFor(() => {
        const emailErrorAppears = screen.queryByText(emailError)
        expect(emailErrorAppears).toBeInTheDocument();
    })

});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    // Arrange
    render(<ContactForm />)
    const button = screen.getByRole('button');
    const lastNameError = 'Error: lastName is a required field.'

    // Act
    userEvent.click(button);

    //Assert
    await waitFor(() => {
        const lastNameErrorAppears = screen.queryByText(lastNameError);
        expect(lastNameErrorAppears).toBeInTheDocument();
    })
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    // Arrange
    render(<ContactForm />)
    const firstName = "Bradley"
    const lastName = "Morris"
    const email = "abcd@abcd.com"
    const messageText = "Hello!"
    const messageLabel = "Message:"

    const firstInput = screen.getByLabelText(/first name/i);
    const lastInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    const button = screen.getByRole('button');

    // Act
    userEvent.type(firstInput, firstName);
    userEvent.type(lastInput, lastName);
    userEvent.type(emailInput, email);
    // userEvent.type(messageInput, messageText)
    userEvent.click(button)

    await waitFor(() => {
        const firstNameOnScreen = screen.queryByText(firstName);
        expect(firstNameOnScreen).toBeInTheDocument();

        const message = screen.queryByText(messageLabel);
        expect(message).not.toBeInTheDocument();
    })

});

test('renders all fields text when all fields are submitted.', async () => {

    // Arrange
    render(<ContactForm />)

    const firstInput = screen.getByLabelText(/first name/i);
    const lastInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    const button = screen.getByRole('button');

    // Act
    userEvent.type(firstInput, "bradley");
    userEvent.type(lastInput, "morris");
    userEvent.type(emailInput, "abcd@abcd.com");
    userEvent.type(messageInput, "Hello! I'm Brad!")
    
    
    userEvent.click(button)

    // Assert
    await waitFor(() => {
        const fisrtNameDisplay = screen.queryByText("bradley")
        expect(fisrtNameDisplay).toBeInTheDocument();

        const lastNameDisplay = screen.queryByText("morris")
        expect(lastNameDisplay).toBeInTheDocument();

        const emailDisplay = screen.queryByText("abcd@abcd.com")
        expect(emailDisplay).toBeInTheDocument();

        const messageDisplay = screen.queryByText("Hello! I'm Brad!")
        expect(messageDisplay).toBeInTheDocument();

    })

});

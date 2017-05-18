describe('App Test', () => {
  beforeEach(() => cy.visit(Cypress.env('url')));

  it('should say hello world', () => {
    cy.get('[data-automation=hello]').should('have.html', 'Hello world!');
  });
});

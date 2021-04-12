describe('e2e tests', () => {
    it('should show Not Found message when no data is returned', () => {
        // set the intercept in 'spy' mode
        cy.intercept('https://swapi.py4e.com/api/**').as('search');

        // Search for planet - blah - returns no result
        cy.visit('https://starwarssearch.coding42.cyou/');
        cy.get('[data-testid=search-card]').should('be.visible');
        cy.get('[for="planets"]').click();
        cy.get('#query').type('blah');
        cy.get('[data-testid=search-button]').click();

        // wait for the API response before continuing
        cy.wait('@search');
        cy.get('[data-testid=no-result]').should('be.visible');
    });

    it('should display one person when one search result is returned', () => {
        // set the intercept in 'spy' mode
        cy.intercept('https://swapi.py4e.com/api/**').as('search');

        // search for people - Luke - returns one result
        cy.visit('https://starwarssearch.coding42.cyou/');
        cy.get('[data-testid=search-card]').should('be.visible');
        cy.get('[for="people"]').click();
        cy.get('#query').type('Luke');
        cy.get('[data-testid=search-button]').click();

        // wait for the API response before continuing
        cy.wait('@search');
        cy.get('[data-testid=details-card-character]').should('have.length', 1);
        cy.get('[data-testid=details-card-character]').should('be.visible');
        cy.get('[data-testid=character-name]').should('have.text', 'Luke Skywalker');
    })

    it('should display the Leading message when searching', () => {
        // introduce a delay of 2 sec in the response
        cy.intercept('https://swapi.py4e.com/api/**', (req) => {
            req.reply((res) => {
                res.delay = 2000;
                res.send();
            })
        });

        // search for people - Skywalker - returns one result
        cy.visit('https://starwarssearch.coding42.cyou/');
        cy.get('[data-testid=search-card]').should('be.visible');
        cy.get('[for="people"]').click();
        cy.get('#query').type('Skywalker');
        cy.get('[data-testid=search-button]').click();

        // verify the Loading... message is displayed and then it is removed
        cy.get('[data-testid=loading]').should('be.visible');
        cy.get('[data-testid=loading]').should('not.exist');
        cy.get('[data-testid=details-card-character]').should('have.length', 3);
    })
});
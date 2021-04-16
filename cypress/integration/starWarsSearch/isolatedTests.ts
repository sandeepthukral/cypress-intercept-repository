describe('isolated Tests', () => {
    it('should trigger the search with the correct parameters for people search', () => {
        // intercept the api with the correct URL and parameters
        cy.intercept(
            'GET',
            'https://swapi.py4e.com/api/people/?search=Luke',
            { fixture: 'no-results.json'}
        );

        // search
        cy.visit('https://starwarssearch.coding42.cyou/');
        cy.get('[data-testid=search-card]').should('be.visible');
        cy.get('[for="people"]').click();
        cy.get('#query').type('Luke');
        cy.get('[data-testid=search-button]').click();
    });

    it('should trigger the search with the correct parameters for planet search', () => {
        // intercept the api with the correct URL and parameters
        cy.intercept(
            'GET',
            'https://swapi.py4e.com/api/planets/?search=Luke',
            { fixture: 'no-results.json'}
        );

        // search
        cy.visit('https://starwarssearch.coding42.cyou/');
        cy.get('[data-testid=search-card]').should('be.visible');
        cy.get('[for="planets"]').click();
        cy.get('#query').type('Luke');
        cy.get('[data-testid=search-button]').click();
    });

    it('should display Not Found when no search result is returned', () => {
        // intercept the api request and stub the response to 'no results'
        cy.intercept(
            'GET',
            'https://swapi.py4e.com/api/**',
            {fixture: 'no-results.json'}
        );

        // search
        cy.visit('https://starwarssearch.coding42.cyou/');
        cy.get('[data-testid=search-card]').should('be.visible');
        cy.get('[for="planets"]').click();
        cy.get('#query').type('blah');
        cy.get('[data-testid=search-button]').click();

        // check if the 'No results' element is displayed
        cy.get('[data-testid=no-result]').should('be.visible');
    })

    it('should display one person when one search result is returned', () => {
        // intercept the api request and stub the response to 'one result'
        cy.intercept(
            'GET',
            'https://swapi.py4e.com/api/**',
            {fixture: 'people-one-result.json'}
        );

        // search for person
        cy.visit('https://starwarssearch.coding42.cyou/');
        cy.get('[data-testid=search-card]').should('be.visible');
        cy.get('[for="people"]').click();
        cy.get('#query').type('Luke');
        cy.get('[data-testid=search-button]').click();

        // check only one result is displayed
        cy.get('[data-testid=details-card-character]').should('have.length', 1);
        cy.get('[data-testid=details-card-character]').should('be.visible');
        // check that the important information is displayed
        cy.get('[data-testid=character-name]').should('have.text', 'Luke Skywalker');
        cy.get('[data-testid=gender-value]').should('have.text', 'male');
        // and more checks like that
    })

    it('should display three persons when three search result are returned', () => {
        // intercept the api request and stub the response to 'three results'
        cy.intercept(
            'GET',
            'https://swapi.py4e.com/api/**',
            { fixture: 'people-three-results.json' }
        );

        // search for person
        cy.visit('https://starwarssearch.coding42.cyou/');
        cy.get('[data-testid=search-card]').should('be.visible');
        cy.get('[for="people"]').click();
        cy.get('#query').type('Luke');
        cy.get('[data-testid=search-button]').click();

        // check that there are three cards and check their names
        cy.get('[data-testid=details-card-character]').should('have.length', 3);
        cy.get('[data-testid=character-name]').eq(0).should('have.text', 'Luke Skywalker');
        cy.get('[data-testid=character-name]').eq(1).should('have.text', 'Anakin Skywalker');
        cy.get('[data-testid=character-name]').eq(2).should('have.text', 'Shmi Skywalker');
    })

    it('should display the Loading... message when searching', () => {
        // introduce a delay of 2 sec in the response
        cy.intercept(
            'GET',
            'https://swapi.py4e.com/api/**',
            { fixture: 'people-three-results.json', delay: 2000 }
        );

        // search for person
        cy.visit('https://starwarssearch.coding42.cyou/');
        cy.get('[data-testid=search-card]').should('be.visible');
        cy.get('[for="people"]').click();
        cy.get('#query').type('Luke');
        cy.get('[data-testid=search-button]').click();

        // verify the Loading... message is displayed and then it is removed
        cy.get('[data-testid=loading]').should('be.visible');
        cy.get('[data-testid=loading]').should('not.exist');
        // verify that the expected data has been displayed after the Loading... message is removed
        cy.get('[data-testid=details-card-character]').should('have.length', 3);
    })

});
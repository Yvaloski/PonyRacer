import * as Webstomp from 'webstomp-client';

describe('Ponyracer', () => {
  const user = {
    id: 1,
    login: 'cedric',
    money: 1000,
    registrationInstant: '2015-12-01T11:00:00Z',
    token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.5cAW816GUAg3OWKWlsYyXI4w3fDrS5BpnmbyBjVM7lo'
  };
  type UserModel = typeof user;

  const race = {
    id: 12,
    name: 'Paris',
    ponies: [
      { id: 1, name: 'Gentle Pie', color: 'YELLOW' },
      { id: 2, name: 'Big Soda', color: 'ORANGE' },
      { id: 3, name: 'Gentle Bottle', color: 'PURPLE' },
      { id: 4, name: 'Superb Whiskey', color: 'GREEN' },
      { id: 5, name: 'Fast Rainbow', color: 'BLUE' }
    ],
    startInstant: '2020-02-18T08:02:00Z'
  };

  function buildFakeWS() {
    const fakeWS = {
      close: () => {
        return;
      },
      send: (message: string) => {
        const unmarshalled = Webstomp.Frame.unmarshallSingle(message);
        if (unmarshalled.command === 'CONNECT') {
          fakeWS.onmessage!({ data: Webstomp.Frame.marshall('CONNECTED') } as MessageEvent);
        } else if (unmarshalled.command === 'SUBSCRIBE' && unmarshalled.headers['destination'] === '/player/1') {
          fakeWS.id = unmarshalled.headers['id'];
        }
      },
      emulateScore: (userModel: UserModel) => {
        const headers = {
          destination: '/player/1',
          subscription: fakeWS.id
        };
        const data = Webstomp.Frame.marshall('MESSAGE', headers, JSON.stringify(userModel));
        fakeWS.onmessage!({ data } as MessageEvent);
      }
    } as WebSocket & { id: string | undefined; emulateScore: (user: UserModel) => void };
    const wsOptions = {
      onBeforeLoad: (win: Window) => {
        cy.stub(win as Window & { WebSocket: WebSocket }, 'WebSocket')
          .as('ws')
          .returns(fakeWS);
      }
    };
    return { fakeWS, wsOptions };
  }

  function startBackend(): void {
    cy.intercept('POST', 'api/users/authentication', user).as('authenticateUser');

    cy.intercept('GET', 'api/races?status=PENDING', [
      race,
      {
        id: 13,
        name: 'Tokyo',
        ponies: [
          { id: 6, name: 'Fast Rainbow', color: 'BLUE' },
          { id: 7, name: 'Gentle Castle', color: 'GREEN' },
          { id: 8, name: 'Awesome Rock', color: 'PURPLE' },
          { id: 9, name: 'Little Rainbow', color: 'YELLOW' },
          { id: 10, name: 'Great Soda', color: 'ORANGE' }
        ],
        startInstant: '2020-02-18T08:03:00Z'
      }
    ]).as('getRaces');
  }

  function storeUserInLocalStorage(): void {
    localStorage.setItem('rememberMe', JSON.stringify(user));
  }

  beforeEach(() => {
    startBackend();
    localStorage.setItem('preferred-lang', 'en');
  });

  it('should display title on home page', () => {
    cy.visit('/');
    cy.contains('h1', 'Ponyracer');
    cy.contains('small', 'Always a pleasure to bet on ponies');
    cy.get('.btn-primary').contains('Login').should('have.attr', 'href', '/users/login');
    cy.get('.btn-primary').contains('Register').should('have.attr', 'href', '/users/register');
  });

  const navbarBrand = '.navbar-brand';
  const navbarLink = '.nav-link';

  it('should display a navbar', () => {
    cy.visit('/');
    cy.get(navbarBrand).contains('PonyRacer').should('have.attr', 'href', '/');
    cy.get(navbarLink).should('not.exist');
  });

  it('should display a navbar collapsed on small screen', () => {
    storeUserInLocalStorage();
    cy.viewport('iphone-6+');
    cy.visit('/');
    cy.contains(navbarBrand, 'PonyRacer');
    cy.get(navbarLink).should('not.be.visible');

    // toggle the navbar
    cy.get('.navbar-toggler').click();
    cy.get(navbarLink).should('exist');
  });

  it('should log out the user', () => {
    storeUserInLocalStorage();
    const { fakeWS, wsOptions } = buildFakeWS();
    cy.visit('/races', wsOptions);
    cy.wait('@getRaces').its('request.headers').should('have.property', 'authorization', `Bearer ${user.token}`);

    cy.get('@ws').should('be.called');

    // user stored should be displayed
    cy.get('#current-user').should('contain', 'cedric').and('contain', '1,000');
    cy.wait(1000);

    let angular: any;
    cy.window().then((win: Window) => (angular = (win as any).ng));
    let document: Document;
    cy.document().then(doc => (document = doc));

    cy.get('#current-user').then(() => {
      fakeWS.emulateScore({
        ...user,
        money: 1200
      });
      const element = document.querySelector('pr-menu');
      const liveComponent = angular.getComponent(element);
      angular.applyChanges(liveComponent);
    });

    // user score updated
    cy.get('#current-user').should('contain', 'cedric').and('contain', '1,200');

    // logout
    cy.get('span.fa.fa-power-off').click();

    // should be redirected to home page
    cy.location('pathname')
      .should('eq', '/')
      // and localStorage should be clean
      .and(() => expect(localStorage.getItem('rememberMe')).to.eq(null));
    cy.get(navbarLink).should('not.exist');

    // user is not displayed in navbar
    cy.get('#current-user').should('not.exist');

    // and home page offers the login link
    cy.get('.btn-primary').contains('Login').should('have.attr', 'href', '/users/login');
  });
});

describe('ComponentName.cy.js', () => {
  beforeEach(() =>{
   cy.visit('http://localhost:5500')
  })

  it('allows user to submit', () => {

    cy.get('h1').should('contain.text', 'Login');
    
    cy.get('input').type('mog')

    cy.get('button').click('')
  })
})
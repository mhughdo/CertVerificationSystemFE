describe("Xem bằng tốt nghiệp của sinh viên", () => {
  beforeEach(() => {
      cy.viewport(1300, 1000)
    })

  it('Xem chi tiết bằng tốt nghiệp của sinh viên', () => {
    cy.visit('http://localhost:3000/')
    cy.get('article').click()
    cy.get('#__next > div > div > div > div > main > div > div > div > div > div.css-1go72ex > div:nth-child(1) > div.css-15n17ca > p.chakra-text.css-1e36u19').then(($p) => {
      expect($p, 'text content').to.have.text('VIETNAM NATIONAL UNIVERSITY, HANOI')
    })
    })
})

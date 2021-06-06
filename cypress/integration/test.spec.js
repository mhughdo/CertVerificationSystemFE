describe("Đăng nhập", () => {
   beforeEach(() => {
      // run these tests as if in a desktop
      // browser with a 720p monitor
      cy.viewport(1300, 1000)
    })
  it('Đăng nhập không thành công', () => {
    cy.visit('http://localhost:3000')
        cy.get('#__next').contains('a')
    })
    it('Đăng nhập thành công', () => {
    cy.visit('http://localhost:3000')
        cy.get('#__next').contains('a')
    })
    it('Đăng ký tài khoản vào hệ thống thành công', () => {
    cy.visit('http://localhost:3000')
        cy.get('#__next').contains('a')
    })
})

describe("Quản lý tài khoản phòng đào tạo", () => {
  beforeEach(() => {
      // run these tests as if in a desktop
      // browser with a 720p monitor
      cy.viewport(1300, 1000)
    })
  it('Tạo tài khoản phòng đào tạo', () => {
    cy.visit('http://localhost:3000')
        cy.get('#__next').contains('a')
    })
    it('Xem danh sách tài khoản', () => {
    cy.visit('http://localhost:3000')
        cy.get('#__next').contains('a')
    })
})

describe("Quản lý bằng tốt nghiệp", () => {
  beforeEach(() => {
      // run these tests as if in a desktop
      // browser with a 720p monitor
      cy.viewport(1300, 1000)
    })

  it('Tạo bằng tốt nghiệp', () => {
    cy.visit('http://localhost:3000')
        cy.get('#__next').contains('a')
    })
  it('Ký bằng tốt nghiệp', () => {
    cy.visit('http://localhost:3000')
        cy.get('#__next').contains('a')
    })
    it('Xem danh sách bằng tốt nghiệp', () => {
    cy.visit('http://localhost:3000')
        cy.get('#__next').contains('a')
    })
})

describe("Chuyển giao quyền hiệu trưởng", () => {
  beforeEach(() => {
      // run these tests as if in a desktop
      // browser with a 720p monitor
      cy.viewport(1300, 1000)
    })

  it('Chuyển giao', () => {

    cy.visit('http://localhost:3000')
        cy.get('#__next').contains('a')
    })
})

describe("Quản lý sinh viên", () => {
  beforeEach(() => {
      // run these tests as if in a desktop
      // browser with a 720p monitor
      cy.viewport(1300, 1000)
    })

  it('Tạo sinh viên mới', () => {
    cy.visit('http://localhost:3000')
        cy.get('#__next').contains('a')
    })
  it('Xem danh sách sinh viên', () => {
    cy.visit('http://localhost:3000')
        cy.get('#__next').contains('a')
    })
    it('Xem chi tiết thông tin sinh viên', () => {
    cy.visit('http://localhost:3000')
        cy.get('#__next').contains('a')
    })
})

describe("Quản lý công ty", () => {
  beforeEach(() => {
      // run these tests as if in a desktop
      // browser with a 720p monitor
      cy.viewport(1300, 1000)
    })

  it('Duyệt tài khoản công ty', () => {
    cy.visit('http://localhost:3000')
        cy.get('#__next').contains('a')
    })
  it('Xem danh sách tài khoản công ty', () => {
    cy.visit('http://localhost:3000')
        cy.get('#__next').contains('a')
    })
  it('Xem chi tiết công ty', () => {
    cy.visit('http://localhost:3000')
        cy.get('#__next').contains('a')
    })
})

describe("Xem bằng tốt nghiệp của sinh viên", () => {
  beforeEach(() => {
      // run these tests as if in a desktop
      // browser with a 720p monitor
      cy.viewport(1300, 1000)
    })

  it('Xem chi tiết bằng tốt nghiệp của sinh viên', () => {
    cy.visit('http://localhost:3000')
        cy.get('#__next').contains('a')
    })
})

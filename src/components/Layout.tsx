import { FC, useState } from 'react'
import Image from 'next/image'
import { Transition } from '@headlessui/react'
import useOnclickOutside from 'react-cool-onclickoutside'
import { Role, useAppState } from '@store/appState'
import { useRouter } from 'next/router'

const Layout: FC = ({ children }) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false)
  const [mainMenuOpen, setMainMenuOpen] = useState<boolean>(false)
  const { asPath } = useRouter()
  const ref = useOnclickOutside(() => {
    setProfileMenuOpen(false)
  })

  const { state } = useAppState()
  const { user } = state

  const activeLinkClasses = 'bg-gray-900 text-white'
  const linkClasses = 'text-gray-300 hover:bg-gray-700 hover:text-white'
  const getLinkClassName = (path) =>
    `${asPath === path ? activeLinkClasses : linkClasses} px-3 py-2 rounded-md text-sm font-medium`

  const RectorNav = (
    <>
      <a href='/' className={getLinkClassName('/')}>
        Dashboard
      </a>

      <a href='/' className={getLinkClassName('/certificate/manage')}>
        Team
      </a>
    </>
  )

  const roleToNav = {
    [Role.RECTOR]: RectorNav,
  }

  return (
    <>
      <div className=''>
        <div className='bg-gray-100 h-screen'>
          <div>
            <div className='bg-gray-800 pb-32'>
              <nav className='bg-gray-800'>
                <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
                  <div className='border-b border-gray-700'>
                    <div className='flex items-center justify-between h-16 px-4 sm:px-0'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0'>
                          <Image width='32px' height='32px' src='/logo.png' alt='Workflow' />
                        </div>
                        <div className='hidden md:block'>
                          <div className='ml-10 flex items-baseline space-x-4'>
                            {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                            {roleToNav[user.role] || null}
                          </div>
                        </div>
                      </div>
                      <div className='hidden md:block'>
                        <div className='ml-4 flex items-center md:ml-6'>
                          {/* Profile dropdown */}

                          <div ref={ref} className='ml-3 relative'>
                            <div>
                              <button
                                type='button'
                                className='max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'
                                id='user-menu'
                                aria-haspopup='true'
                                aria-expanded={!!profileMenuOpen}
                                onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
                                <span className='sr-only'>Open user menu</span>
                                <img
                                  className='h-8 w-8 rounded-full'
                                  src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&amp;ixqx=cII20c177f&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80'
                                  alt=''
                                />
                              </button>
                            </div>

                            <Transition
                              show={profileMenuOpen}
                              enter='transition ease-out duration-100'
                              enterFrom='transform opacity-0 scale-95'
                              enterTo='transform opacity-100 scale-100'
                              leave='transition ease-in duration-75'
                              leaveFrom='transform opacity-100 scale-100'
                              leaveTo='transform opacity-0 scale-95'
                              className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'
                              role='menu'
                              aria-orientation='vertical'
                              aria-labelledby='user-menu'>
                              <a
                                href='/'
                                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                                role='menuitem'>
                                Your Profile
                              </a>
                            </Transition>
                          </div>
                        </div>
                      </div>
                      <div className='-mr-2 flex md:hidden'>
                        {/* Mobile menu button */}
                        <button
                          type='button'
                          className='bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'
                          aria-controls='mobile-menu'
                          aria-expanded={!!mainMenuOpen}
                          onClick={() => setMainMenuOpen(!mainMenuOpen)}>
                          <span className='sr-only'>Open main menu</span>

                          <svg
                            className={`block h-6 w-6 ${!mainMenuOpen ? 'block' : 'hidden'}`}
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                            aria-hidden='true'>
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M4 6h16M4 12h16M4 18h16'
                            />
                          </svg>
                          <svg
                            className={`block h-6 w-6 ${mainMenuOpen ? 'block' : 'hidden'}`}
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                            aria-hidden='true'>
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M6 18L18 6M6 6l12 12'
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {mainMenuOpen && (
                  <div
                    data-todo-x-description='Mobile menu, show/hide based on menu state.'
                    className='border-b border-gray-700 md:hidden'
                    id='mobile-menu'>
                    <div className='px-2 py-3 space-y-1 sm:px-3'>
                      {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                      <a href='/' className='bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium'>
                        Dashboard
                      </a>

                      <a
                        href='/'
                        className='text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium'>
                        Team
                      </a>

                      <a
                        href='/'
                        className='text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium'>
                        Projects
                      </a>

                      <a
                        href='/'
                        className='text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium'>
                        Calendar
                      </a>

                      <a
                        href='/'
                        className='text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium'>
                        Reports
                      </a>
                    </div>
                    <div className='pt-4 pb-3 border-t border-gray-700'>
                      <div className='flex items-center px-5'>
                        <div className='flex-shrink-0'>
                          <img
                            className='h-10 w-10 rounded-full'
                            src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&amp;ixqx=cII20c177f&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80'
                            alt=''
                          />
                        </div>
                        <div className='ml-3'>
                          <div className='text-base font-medium leading-none text-white'>Tom Cook</div>
                          <div className='text-sm font-medium leading-none text-gray-400'>tom@example.com</div>
                        </div>
                        {/* <button className='ml-auto bg-gray-800 flex-shrink-0 p-1 text-gray-400 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'>
                        <span className='sr-only'>View notifications</span>
                        <svg
                          className='h-6 w-6'
                          data-todo-x-description='Heroicon name: outline/bell'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                          aria-hidden='true'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                          />
                        </svg>
                      </button> */}
                      </div>
                      <div className='mt-3 px-2 space-y-1'>
                        <a
                          href='/'
                          className='block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700'>
                          Your Profile
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </nav>
              <header className='py-10'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                  <h1 className='text-3xl font-bold text-white'>Dashboard</h1>
                </div>
              </header>
            </div>

            <main className='-mt-32'>
              <div className='max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8'>
                {/* Replace with your content */}
                <div className='bg-white rounded-lg shadow px-5 py-6 sm:px-6 h-96'>{children}</div>
                {/* /End replace */}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}

export default Layout

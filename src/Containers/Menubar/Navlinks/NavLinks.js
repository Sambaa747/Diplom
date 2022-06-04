import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../../context/auth-context'
import './NavLinks.css'
import { useHistory } from 'react-router-dom'
const NavLinks = (props) => {
  const history = useHistory()
  const auth = useContext(AuthContext)

  function onLgout() {
    console.log(history)
    auth.logout()
    history.push('/auth')
  }
  return (
    <ul className='nav-links'>
      <li>
        <NavLink to='/' exact>
          Нүүр хуудас
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <>
          {' '}
          <li>
            <NavLink to='/company'>Байгууллага</NavLink>
          </li>
          <li>
            <NavLink to='/mycompaign'>Компанит ажил</NavLink>
          </li>
          <li>
            <NavLink to='/create'>Хөрөнгө босгох</NavLink>
          </li>
        </>
      )}

      {/* <li>
      <NavLink to="/auth">AUTHENTICATE</NavLink>
    </li> */}

      {!auth.isLoggedIn && (
        <li>
          <NavLink to='/auth'>Компани</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li className='ddd'>
          <NavLink to='/dwadaw'>Хувь хүн</NavLink>
        </li>
      )}

      {auth.isLoggedIn && (
        <li>
          <button onClick={onLgout}>Гарах</button>
        </li>
      )}
    </ul>
  )
}

export default NavLinks

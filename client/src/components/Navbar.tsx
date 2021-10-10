import React from 'react'
import { NavLink } from 'react-router-dom'

export const Navbar = () => (
    <nav>
      <div className="nav-wrapper blue darcen-1" style={{ padding: "0 2rem" }}>
        <span className="brand-logo"></span>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li>
            <NavLink to="/page-1">Страница №1</NavLink>
          </li>
          <li>
            <NavLink to="/page-2">Страница №2</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )

import React, { useState, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import UpdatePlace from './places/pages/UpdatePlace'
import UserPlaces from './places/pages/UserPlaces'
import Auth from './user/pages/Auth'
import { AuthContext } from './shared/context/auth-context'
import MainNavigation from './shared/components/Navigation/MainNavigation'

const App = () => {
  //const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState(false)
  const [userId, setUserId] = useState(false)

  const login = useCallback((uid, token) => {
    //setIsLoggedIn(true)
    setToken(token)
    setUserId(uid)
  },
    [],
  )
  const logout = useCallback(() => {
    //setIsLoggedIn(false)
    setToken(null)
    setUserId(null)
  }, [])

  let routes;
  //if (isLoggedIn) {
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId" exact>
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    )
  }
  else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path='/auth' exact>
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    )
  }


  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, token: token, userId: userId, login: login, logout: logout }}>
      }>
      <Router>
        <MainNavigation></MainNavigation>
        <main>

          {routes}

        </main>
      </Router >
    </AuthContext.Provider >
  );
};

export default App;

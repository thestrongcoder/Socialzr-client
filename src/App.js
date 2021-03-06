import React, { useReducer, useEffect } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
// import eventData from './data/post_data'

import Index from './components/LandingPage'
import EventPosts from './components/EventPosts'
import EventPost from './components/EventPost'
import EditEventPost from './components/EditEventPost'
import NewEventPost from './components/NewEventPost'
import Nav from './components/Nav'
import SignIn from './components/SignIn'
import Register from './components/Register'
import stateReducer from './config/stateReducer'
import {StateContext} from './config/store'
import {getPostFromId, getAllEventPosts, addEventPost} from './services/eventPostServices'
import { userAuthenticated, getLoggedInUser, setLoggedInUser } from './services/authServices'

import './styles/theme.css'
import './styles/App.css'

const App = () => {

    // initial state for state reducer
  const initialState = {
    eventPosts: [],
    loggedInUser: null
  }
  
  // Create state reducer store and dispatcher
  const [store, dispatch] = useReducer(stateReducer,initialState)
  const {eventPosts} = store

  function fetchEventPosts(){
    getAllEventPosts().then((eventData) => {
      dispatch({
        type: "setEventPosts",
        data: eventData
      })
    }).catch((error) => {
      dispatch({
        type: "setError",
        data: false
      })
      console.log("An error occured fetching event posts from the server: ", error);
    })
  }


  useEffect(() => {
    fetchEventPosts();
    userAuthenticated().then(() => {
      dispatch({
        type: "setLoggedInUser",
        data: getLoggedInUser()
      })
    }).catch((error) => {
      console.log("got an error trying to check authenticated user: ", error)
      setLoggedInUser(null)
      dispatch({
        type: "setLoggedInUser",
        data: null
      })
    })
    // A function that specifies anyactions on component unmount
    return () => {}
  },[])

  return (
      <StateContext.Provider value={{store,dispatch}}>
      <div >
      <BrowserRouter>
      <Nav />
        <Switch>
            <Route path="/" exact component={Index} />
            <Route exact path="/events" component={EventPosts}  />
            <Route exact path="/new-event" render={(props) => <NewEventPost {...props} addEventPost={addEventPost} /> } />
            <Route exact path="/events/:id" render={(props) => <EventPost {...props} post={getPostFromId(eventPosts, props.match.params.id)} showControls /> } />
            <Route exact path="/events/edit/:id" component={EditEventPost} /> 
            <Route exact path="/auth/login" component={SignIn} />
            <Route exact path="/auth/register" component={Register} />
          </Switch> 
        </BrowserRouter>
        </div>
      </StateContext.Provider>
  )
}

export default App

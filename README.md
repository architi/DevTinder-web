# devTinder-web

- Created a Vite + React Application
- Remove unneccesary code & create a hello world app
- Install tainwindCSS
- Install DaisyUI for components
- add navbar component to app.jsx 
- create a seperate NavBar.jsx(export) and then importing it into app.jsx
- Use React-Router to set up routing (EX:- /signup, /login, etc)
- Create BrowserRouter > Routes > Route=/ Body > RouteChildren
- Create Outlet in body component
- Create a footer
 
 ---WALK DOWN---
- Create a login page
- npm i axios
 cause: just like fetch but better at api fetching from backend 
- CORS - npm i cors in backend => add middleware to with configurations: orgin( localhost of frontend), credentials: true
- whenever making API call so pass axios => {withCredentials: true} //in frontend
- install @reduxjs/toolkit + redux-react
 > go through:- https://redux.js.org/tutorials/quick-start
--chain of steps for setting up redux store & slice--
- configureStore => Provider => createSlice => add reducer to store  
- to add data in reduxStore -> dispatch an action
 > useDispatch Hook by react 
- add redux devtools in chrome
- log in & check data is coming properly in the store
- navbar should update when user logs in
- constants file + component folder


BODY
     NavBar
     Route=/ =>Feed
     Route=/login =>Login
     Route=/connections =>Connections
     Route=/profile =>  Profile





import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import About from './pages/CoderxyzContent/About'
import Projects from './pages/Projects'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import Search from './pages/Search'
import PrivateRoute from './components/PrivateRoute'
import CreatePost from './pages/CreatePost'
import PrivateRouteAdmin from './components/PrivateRouteAdmin'
import UpdatePost from './pages/UpdatePost'
import PostPage from './pages/PostPage'
import ScrollToTop from './components/ScrollTop'
import UserProfilePublic from './components/PublicProfile/UserProfilePublic'

import SearchPage from './pages/SearchPage'
import Privacy from './pages/CoderxyzContent/Privacy'

export default function App() {
  return (
    <BrowserRouter>
    <ScrollToTop/>
    <Header />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/about' element={<About />} />
      <Route path='/privacy' element={<Privacy />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/signin' element={<SignIn />} />
      <Route element={<PrivateRoute />}>
      <Route path='/dashboard' element={<Dashboard />} />
      </Route>
      <Route element={<PrivateRouteAdmin/>}>
       <Route path='/create-post' element={<CreatePost/>} />
       <Route path='/update-post/:postId' element={<UpdatePost/>} />
      </Route>
      <Route path='/user/:userName' element={<UserProfilePublic/>} />
      <Route path='/post/:postSlug' element={<PostPage/>} />
      <Route path='/projects' element={<Projects />} />
      <Route path='/search' element={<Search />} />
      <Route path='/searchpage' element={<SearchPage />} />
    </Routes>
    </BrowserRouter>
  );
}

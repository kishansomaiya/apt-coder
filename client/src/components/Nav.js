import colorLogo from '../images/color_tinder_logo.png'
import whiteLogo from '../images/white_tinder_logo.png'


const Nav = ({minimal, setShowModal, showModal, setIsSignUp}) => {

  const authToken = false;

  const handleClick = () => {
    setShowModal(true)
    setIsSignUp(false)
  }
  return (
    <nav>
      <div className="logo-container">
        <img className="logo" src="" alt="" />
      </div>
      {!authToken && !minimal && <button className="nav-button" onClick={handleClick} disabled={showModal}>Log in</button>}
    </nav>
  )
}

export default Nav
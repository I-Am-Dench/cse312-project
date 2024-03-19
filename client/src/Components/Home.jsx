import './Home.css';

const Home = () => {
    return(
        <div className='Home'>
                <div className='header'>
                    <div className='nav-menu'>
                        <h3>JesseFanClub</h3>
                        <ul>
                            <li><a>Home</a></li>
                            <li><a>Login</a></li>
                            <li><a>Register</a></li>
                        </ul>
                    </div>
                </div>
                <body>
                    <div className="board-container">
                        <h2>Boards</h2>
                        <br></br>
                        <p>Lorem Ipsum Dolor</p>
                        <p>Lorem Ipsum Dolor</p>
                        <p>Lorem Ipsum Dolor</p>
                        <p>Lorem Ipsum Dolor</p>
                        <p>Lorem Ipsum Dolor</p>
                        <p>Lorem Ipsum Dolor</p>
                    </div>
                </body>
        </div>
    )
}

export default Home; 
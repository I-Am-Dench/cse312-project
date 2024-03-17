import './Home.css';

const Home = () => {
    return(
        <div className='Home'>
            <div className="background">
                <div className = "navbar">
                    <ul className='links'>
                        <li><a href="/">Home</a></li>
                        <li><a href="/login">Login</a></li>
                        <li><a href="/login">Register</a></li>
                    </ul>
            </div>
                <h1>JesseFanClub's web project</h1>
                <image src='./coolguy.jpeg'/>
            </div>
        </div>
    )
}

export default Home; 
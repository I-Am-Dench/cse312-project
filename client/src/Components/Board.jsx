import './Board.css';

const Board = () => {
    return(
        <div className='Home'>
                <div className='header'>
                    <div className='nav-menu'>
                        <h3>JesseFanClub</h3>
                        <ul>
                            <li><a>Home</a></li>
                            <li><button>Settings</button></li>
                        </ul>
                    </div>
                </div>
                <h1>Board Title</h1>
                <body>
                    <div className='comments'>
                        
                    </div>
                </body>
        </div>
    )
}

export default Board; 
import './Board.css';

const Board = () => {
    return(
        <div className='Board'>
            <div className="background">
                <div className = "navbar">
                    <ul className='links'>
                        <li><a href="/">Home</a></li>
                        <li>Settings</li>
                    </ul>
                </div>
                <h1>JesseFanClub's web project</h1>
                <image src='./coolguy.jpeg'/>

                <div className='chatSection'>
                    <labal>Chat: </labal>
                    <br></br>
                    <button onclick=''>Send</button>
                </div>
            </div>
        </div>
    )
}

export default Board; 
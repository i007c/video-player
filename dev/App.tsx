import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

// master video
import MasterVideo, { Options } from '../lib'

// video file
import videoFile from './videos/2.mp4'

// style
import './style.scss'

import favicon from './favicon.ico'

const PlayerOptions: Options = {
    source: videoFile,
    controls: true,
    style: { className: 'custom-video-player' },
}

const App = () => {
    useEffect(() => {
        document.head.insertAdjacentHTML('beforeend', `<link rel="shortcut icon" href="${favicon}" type="image/x-icon">`);
    }, [])
    return (
        <div className='app'>
            <MasterVideo options={PlayerOptions} />
        </div>
    )
}

export default App

ReactDOM.render(<App />, document.getElementById('root'))

import React, { ReactElement } from 'react'
import BaseComponent from './BaseComponent'

// utils
import { togglePlay, toggleFullScreen } from '../utils'
import TimeConvert from '../utils/TimeConvert'

// components
import CTime from './CTime'
import FullScreen from './icons/FullScreen'
import TimeLine from './TimeLine'
import Volume from './Volume'
// icons
import Play from './icons/Play'

import './sass/controls.scss'

interface ControlsProps {}

interface ControlsState {
    isPlaying: boolean
    isFullScreen: boolean
    isMuted: boolean
    volume: number
    duration: string
    ctrl?: HTMLDivElement
    showTime: boolean
    ctrlObserver?: ResizeObserver
}

const defaultState: ControlsState = {
    isPlaying: false,
    isFullScreen: false,
    isMuted: false,
    volume: 1.0,
    duration: '0:00',
    showTime: true,
}

export class Controls extends BaseComponent<ControlsProps, ControlsState> {
    override state = defaultState

    private CanPlayEventBind = this.CanPlayEvent.bind(this)
    private KeyBind = this.KeyEvent.bind(this)

    private CanPlayEvent() {
        this.setState({ duration: TimeConvert(this.video.duration) })
    }

    private GetVolumeValue(a?: number): number {
        if (a && a < 1 && a > -1) {
            const b = this.video.volume + a
            if (b < 0) {
                this.video.volume = 0
            } else if (b > 1) {
                this.video.volume = 1
            } else {
                this.video.volume = b
            }
        }

        return this.video.volume
    }

    private KeyEvent(e: KeyboardEvent) {
        switch (e.code) {
            case 'Space':
                e.preventDefault()
                return togglePlay(this.video)

            case 'KeyP':
                e.preventDefault()
                return togglePlay(this.video)

            case 'KeyF':
                e.preventDefault()
                return toggleFullScreen(this.master)

            case 'KeyM':
                e.preventDefault()
                return (this.video.muted = !this.video.muted)

            case 'ArrowRight':
                e.preventDefault()
                return (this.video.currentTime += 5)

            case 'ArrowLeft':
                e.preventDefault()
                return (this.video.currentTime -= 5)

            case 'ArrowUp':
                e.preventDefault()
                if (this.video.volume === 1) return
                else return this.GetVolumeValue(0.1)

            case 'ArrowDown':
                e.preventDefault()
                if (this.video.volume === 0) return
                else return this.GetVolumeValue(-0.1)

            default:
                return
        }
    }

    override componentDidMount() {
        this.video.addEventListener('canplay', this.CanPlayEventBind)
        document.addEventListener('keydown', this.KeyBind)
    }

    override componentWillUnmount() {
        this.video.removeEventListener('canplay', this.CanPlayEventBind)
        document.removeEventListener('keydown', this.KeyBind)
        if (this.state.ctrlObserver) {
            this.state.ctrlObserver.disconnect()
        }
    }

    private HandleSizeBind = this.HandleSize.bind(this)

    private CTRLRef(node: HTMLDivElement) {
        this.setState({ ctrl: node })
        this.HandleSizeBind()
    }

    override componentDidUpdate() {
        if (!this.state.ctrl || this.state.ctrlObserver) return

        let cro = new ResizeObserver(this.HandleSizeBind)
        cro.observe(this.state.ctrl)
        this.setState({ ctrlObserver: cro })
    }

    private HandleSize() {
        if (!this.state.ctrl) return

        if (this.state.ctrl.offsetWidth < 400) {
            this.setState({ showTime: false })
        } else {
            this.setState({ showTime: true })
        }
    }

    override render(): ReactElement {
        return (
            <div className='controls-container'>
                <div
                    className='toggle-play'
                    onClick={() => togglePlay(this.video)}
                ></div>
                <div className='controls' ref={this.CTRLRef.bind(this)}>
                    <div
                        className='btn play-pause'
                        onClick={() => togglePlay(this.video)}
                    >
                        <Play />
                    </div>
                    {this.state.showTime && (
                        <div className='timestamp'>
                            <CTime /> / {this.state.duration}
                        </div>
                    )}
                    <div className='timeline'>
                        <TimeLine />
                    </div>
                    <Volume />
                    <div
                        className='btn fullscreen'
                        onClick={() => toggleFullScreen(this.master)}
                    >
                        <FullScreen />
                    </div>
                </div>
            </div>
        )
    }
}

export default Controls

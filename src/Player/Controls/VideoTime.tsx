import React, { PureComponent } from 'react'

interface VideoTimeProps {
    video: HTMLVideoElement
    className: string
}

interface VideoTimeState {
    videoTime: {
        duration: number
        currentTime: number
    }
}

export class VideoTime extends PureComponent<VideoTimeProps, VideoTimeState> {
    private video = this.props.video

    override state: VideoTimeState = {
        videoTime: {
            duration: 0,
            currentTime: 0,
        },
    }

    private TimeConvert(seconds: number): string {
        let h = Math.floor(seconds / 3600)
        let m = Math.floor((seconds % 3600) / 60)
        let s = Math.floor((seconds % 3600) % 60)

        let SC = (t: number): string => {
            if (t === 0) return '00'
            else if (t < 10) return '0' + t
            else return t.toString()
        }

        let MHC = (t: number): string => {
            if (t === 0) return '0'
            else if (t < 10) return '0' + t
            else return t.toString()
        }

        return h === 0 ? `${MHC(m)}:${SC(s)}` : `${MHC(h)}:${MHC(m)}:${SC(s)}`
    }

    override componentDidMount() {
        this.video.addEventListener('canplay', () => {
            this.setState({
                videoTime: {
                    duration: Math.floor(this.video.duration),
                    currentTime: Math.floor(this.video.currentTime),
                },
            })
        })

        this.video.addEventListener('timeupdate', () => {
            this.setState({
                videoTime: {
                    duration: Math.floor(this.video.duration),
                    currentTime: Math.floor(this.video.currentTime),
                },
            })
        })
    }

    override render() {
        return (
            <div className={this.props.className}>
                <span>
                    {this.TimeConvert(this.state.videoTime.currentTime)} /{' '}
                    {this.TimeConvert(this.state.videoTime.duration)}
                </span>
            </div>
        )
    }
}

export default VideoTime
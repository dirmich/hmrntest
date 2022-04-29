// [WEB]
//import EventEmitter from 'eventemitter2'
//[MOBILE]
import EventEmitter from 'events'
import {RTCPeerConnection, RTCSessionDescription} from 'react-native-webrtc'

import {v4} from 'uuid'
/*
    Events  (this, param)

    candidate   -> trickle
    stream  -> remote stream
    close -> terminated?
*/
const peerConnectionConfig = {
  iceServers: [
    {
      username: '',
      credential: '',
      urls: ['stun:stun.l.google.com:19302'],
    },
    {
      username: 'webrtc',
      credential: 'webrtc',
      urls: ['turn:highmaru.com:3478'],
    },
    {
      username: '',
      credential: '',
      urls: ['stun:highmaru.com:3478'],
    },
  ],
  iceTransportPolicy: 'all',
}

class Peer extends EventEmitter {
  constructor(config) {
    super()
    this.id = v4()
    this.log = console.log
    this.opt = {...peerConnectionConfig, ...config}
    this.pc = this._create()
    this.stream = null
    this.ready = false
    // this.rstream = null
  }

  _create() {
    const p = new RTCPeerConnection(this.opt)

    p.onicecandidate = e => {
      this.emit(
        'candidate',
        this,
        e.candidate ? e.candidate : {completed: true},
      )
    }

    // [WEB]
    // p.ontrack = (e) => {
    //   this.log('ONTRACK] ', e)
    //   if (!e.streams || e.streams.length === 0) return

    //   const stream = e.streams[0]
    //   this.stream = stream
    //   this.log('STREAM]', stream)
    //   this.emit('stream', this)

    //   stream.onaddtrack = (t) => {
    //     this.log('onaddtrack', t)
    //   }
    //   stream.onremovetrack = (t) => {
    //     this.log('onremovetrack', t)
    //   }
    //   e.track.onended = (t) => {
    //     this.log('onended', t)
    //   }
    //   e.track.onisolationchange = (t) => {
    //     this.log('onisolationchange', t)
    //   }
    //   e.track.onmute = (t) => {
    //     this.log('onmute', t)
    //   }
    //   e.track.onunmute = (t) => {
    //     this.log('onunmute', t)
    //   }
    //   this.emit('ontrack', e)
    // }
    // [MOBILE]
    p.onaddstream = e => {
      this.stream = e.stream
      console.log('STREAM', e.stream)
      this.emit('stream', this, e.stream)
    }
    p.onnegotiationneeded = () => {
      this.iceConnectionState = p.iceConnectionState
      this.log('onnegotiationneeded', p.iceConnectionState)
      this.emit('onnegotiationneeded', this)
    }
    p.oniceconnectionstatechange = e => {
      this.iceConnectionState = p.iceConnectionState
      this.log('oniceconnectionstatechange', p.iceConnectionState)
      if (p.iceConnectionState === 'disconnected') {
        this.log('disconnected')
        this.emit('close', this, false)
      }
    }
    p.onicegatheringstatechange = e => {
      this.iceGatheringState = p.iceGatheringState
      this.log('onicegatheringstatechange', p.iceGatheringState)
    }
    p.onsignalingstatechange = e => {
      this.signalingState = p.signalingState

      this.log('onsignalingstatechange ', e.currentTarget.signalingState, e)
      if (p.connectionState === 'connected') {
        // connected
      } else if (p.connectionState === 'closed' && !this.terminated) {
        // this.renegotiate({}).then(config=>this.log('reconfigured',config)).catch(e=>this.log('err',e))
      }
    }
    return p
  }

  // [WEB]
  // async addTrack(tracks, type) {
  //   // type : audio, video
  //   const track = tracks.find((t) => t.kind === type)
  //   let tcv = this.getTransceiver(type === 'audio')
  //   if (tcv) {
  //     tcv.direction = 'sendonly'
  //   } else {
  //     if (this.pc.signalingState === 'closed' && !this.terminated) {
  //       // this.createPeerConnection(this.rtcConfiguration)
  //       return
  //     }
  //     tcv = this.pc.addTransceiver(type, { direction: 'sendonly' })
  //   }
  //   await tcv.sender.replaceTrack(track)
  // }

  // async setLocalStream(stream, audioOnly = false) {
  //   this.stream = stream
  //   this.log('LOCAL STREAM]', stream)
  //   const tracks = stream.getTracks()
  //   // try {
  //   //   this.log('addStream', stream, tracks)
  //   //   await this.addTrack(tracks, 'audio')
  //   //   if (!audioOnly) await this.addTrack(tracks, 'video')
  //   //   stream.getTracks().forEach((track) => this.pc.addTrack(track, stream))
  //   // } catch (e) {
  //   //   console.error('ADDSTREAM]', e.toString())
  //   // }
  //   let videoTrack = tracks.find((t) => t.kind === 'video')

  //   let audioTrack = tracks.find((t) => t.kind === 'audio')

  //   let vt = this.getTransceiver()

  //   let at = this.getTransceiver(true)

  //   if (vt && at) {
  //     console.log('tr exist')
  //     vt.direction = 'sendonly'
  //     at.direction = 'sendonly'
  //   } else {
  //     //TODO DOMException: Failed to execute 'addTransceiver' on 'RTCPeerConnection': The RTCPeerConnection's signalingState is 'closed'
  //     if (this.pc.signalingState === 'closed' && !this.terminated) {
  //       this.createPeerConnection(this.rtcConfiguration)
  //     }
  //     vt = this.pc.addTransceiver('video', { direction: 'sendonly' })
  //     at = this.pc.addTransceiver('audio', { direction: 'sendonly' })
  //   }

  //   await vt.sender.replaceTrack(videoTrack)
  //   this.log('replace VIDEO', videoTrack)
  //   await at.sender.replaceTrack(audioTrack)
  //   this.log('replace AUDIO', audioTrack)
  // }

  // [MOBILE]
  async setLocalStream(stream, audioOnly = false) {
    this.pc.addStream(stream)
    this.stream = stream
  }

  stopStreams() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        //[WEB]
        // this.pc.getSenders().map(s => this.pc.removeTrack(s))
        track.stop()
      })
      this.stream = null
    }
  }

  close() {
    if (this.pc) {
      this.pc.close()
      this.pc = null
    }
    if (this.stream) {
      this.stopStreams()
    }
    this.emit('close', this, true)
  }

  async createOffer(audioOnly = false) {
    try {
      const p = this.pc

      const offer = await p.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: !audioOnly,
        voiceActivityDetection: !audioOnly,
      })
      await p.setLocalDescription(offer)

      return offer
    } catch (e) {
      console.error('Err:getOffer', e)
    }
  }

  async setAnswer(offer, cb) {
    try {
      const p = this.pc
      await p.setRemoteDescription(new RTCSessionDescription(offer))
      if (cb) {
        const answer = await p.createAnswer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        })
        await p.setLocalDescription(answer)
        cb(answer)
      }
      //   this.log('SET ANSWER]')
    } catch (e) {
      console.error('Err:setAnswer', e)
    }
  }

  async trickle(ice) {
    try {
      this.log('receive candidate', ice)
      if (ice) {
        if (!!ice.completed) {
          if (!ice.completed) await this.pc.addIceCandidate(ice)
          else this.log('candidate complete')
        } else {
          await this.pc.addIceCandidate(ice)
        }
      }
    } catch (e) {
      console.error('Err:trickle', e, ice)
    }
  }

  // [WEB]
  // getTransceiver(audio = false) {
  //   const kind = audio ? 'audio' : 'video'

  //   let transceiver = null
  //   let transceivers = this.pc.getTransceivers()

  //   if (transceivers && transceivers.length > 0) {
  //     const target = transceivers.filter(
  //       t =>
  //         (t.sender && t.sender.track && t.sender.track.kind === kind) ||
  //         (t.receiver && t.receiver.track && t.receiver.track.kind === kind),
  //     )
  //     if (target.length > 0) transceiver = target[0]
  //   }
  //   return transceiver
  // }
}

export default Peer

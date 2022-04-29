import EventEmitter from 'events'
import Nats from './nats'
import Peer from './peer'

/*
[Protocol]
    server
        .announce
        .warn
    user.{receiver}.{sender}
        .
    room.[cmd].{#room}
        .list
        .open.[owner_id]
        .enter
        .send
        .leave

[Event]
    enter   <peer>
    exit   <peer>   peer leave
    close   <peer>   peer kicked
    stream  <peer> <stream>
*/
class RoomAgent extends EventEmitter {
  constructor() {
    if (RoomAgent.instance) {
      console.log('exist')
      return RoomAgent.instance
    }
    super()
    console.log('new roomagent')
    RoomAgent.instance = this

    this.init()
  }

  async init() {
    this.peers = []
    this.localstream = null
    this.user = null
    this.sock = Nats
    this.option = {
      audio: true,
      video: true,
    }
    this.listening = false
  }

  async close() {
    this.peers.map(p => {
      this.send(p.user, 'leave', {})
      p.close()
    })
    this.sock.close()
    await this.init()
  }

  async connect() {
    await this.sock.connect()
  }

  setUser(user) {
    this.user = user
    this.sock.subscribe(`user.${user}.>`, this.onReceiveUser.bind(this))
  }

  setStream(stream) {
    this.localstream = stream
  }

  permitEnter(user) {
    this.send(user, 'permit', this.option)
  }
  send(user, cmd, data) {
    this.sock.publish(`user.${user}.${this.user}.${cmd}`, data)
  }
  async createPeer() {
    const p = new Peer()
    p.on('stream', (peer, stream) => {
      console.log('RECV STREAM]', stream)
      //   p.stream = stream
      this.emit('stream', peer, stream)
      this.emit('enter', peer)
    })
    p.on('candidate', (peer, d) => {
      this.send(peer.user, 'ctrl.trickle', d)
    })
    p.on('close', (peer, terminated) => {
      this.peers = this.peers.filter(p => p.id !== peer.id)
      this.emit(terminated ? 'close' : 'exit', peer)
    })
    p.on('onnegotiationneeded', async peer => {
      if (!peer.ready) {
        const offer = await peer.createOffer()
        this.send(peer.user, 'ctrl.offer', offer)
      } else {
        console.log('LISTENING]')
        peer.ready = true
      }
    })
    await p.setLocalStream(this.localstream)
    return p
  }

  async getPeer(sender) {
    console.log('getPeer', sender)
    const target = this.peers.filter(p => p.user === sender)
    if (target.length > 0) return target[0]
    else {
      console.log('new', this.peers)
      const p = await this.createPeer()
      p.user = sender
      this.peers.push(p)
      console.log('P]', this.peers)
      return p
    }
  }

  hello() {
    if (this.user !== 'test1') this.send('test1', 'hello', {a: 1, b: 1})
  }

  async onReceiveUser(subj, data, respond) {
    const cmd = subj.split('.')
    if (cmd.length < 3) return false
    const sender = cmd[2]
    const peer = await this.getPeer(sender)

    switch (cmd[3]) {
      case 'hello':
        this.permitEnter(sender)
        break
      case 'permit':
        {
          if (data.audio || data.video) {
            peer.ready = true
            // const offer = await peer.createOffer()
            // this.send(sender, 'ctrl.offer', offer)
          }
        }
        break
      case 'leave':
        {
          this.emit('exit', peer)
          this.peers = this.peers.filter(p => p.id !== peer.id)
        }
        break
      case 'ctrl':
        {
          if (!cmd[4]) return false
          switch (cmd[4]) {
            case 'offer':
              {
                await peer.setAnswer(data, answer => {
                  this.send(sender, 'ctrl.answer', answer)
                })
              }
              break
            case 'answer':
              {
                await peer.setAnswer(data)
              }
              break
            case 'trickle':
              {
                await peer.trickle(data)
              }
              break
          }
        }
        break
    }
    return false
  }
}

export default new RoomAgent()

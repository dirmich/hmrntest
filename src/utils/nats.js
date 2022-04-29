// const WebSocket = require('ws')

// const MSG =
//   /^MSG\s+([^\s\r\n]+)\s+([^\s\r\n]+)\s+(([^\s\r\n]+)[^\S\r\n]+)?(\d+)\r\n(.*)/i
const MSG =
  /^MSG\s+([^\s\r\n]+)\s+([^\s\r\n]+)\s+(([^\s\r\n]+)[^\S\r\n]+)?(\d+)\r\n/i
const OK = /^\+OK\s*\r\n/i
const ERR = /^-ERR\s+('.+')?\r\n/i
const PING = /^PING\r\n/i
const PONG = /^PONG\r\n/i
const INFO = /^INFO\s+([^\r\n]+)\r\n/i
const SUBRE = /^SUB\s+([^\r\n]+)\r\n/i

const CMD = {
  MSG: 1,
  OK: 0,
  ERR: -1,
  PING: 2,
  PONG: 3,
  INFO: 4,
}
const STATE = {
  WAIT_MSG: 0,
  WAIT_PAYLOAD: 1,
}

var concat = function (buffers) {
  const buffersLengths = buffers.map(function (b) {
    return b.byteLength
  })
  const totalBufferlength = buffersLengths.reduce(function (p, c) {
    return p + c
  }, 0)
  const unit8Arr = new Uint8Array(totalBufferlength)
  buffersLengths.reduce(function (p, c, i) {
    unit8Arr.set(new Uint8Array(buffers[i]), p)
    return p + c
  }, 0)
  return unit8Arr.buffer
}
class Nats {
  constructor(url, opt = {}, timeout = 5000) {
    if (Nats.instance) {
      console.log('NATS] exist')
      return Nats.instance
    }
    Nats.instance = this
    const defaultOpt = {
      verbose: false,
      echo: false,
      lang: 'mobile',
      version: '1.0',
      tls_required: true,
      pedantic: false,
      protocol: 1,
    }
    this.url = url
    this.subs = []
    this.hash = []
    this.enc = new TextEncoder()
    this.dec = new TextDecoder('utf-8')
    this.sid = 0
    this.rid = 1
    this.opt = {...defaultOpt, ...opt}
    this.timeout = timeout
    this.isConnected = false
    this.terminated = false
    this.state = STATE.WAIT_MSG
    this.inbound = null
    this.payload = null
  }
  async connect() {
    if (this.isConnected) return
    if (this.sock) {
      this.close(true)
    }
    this.terminated = false
    const ws = new WebSocket(this.url)
    ws.binaryType = 'arraybuffer'
    this.setEvents(ws)
    this.sock = ws

    return new Promise((resolve, reject) => {
      this.cb = d => {
        console.log('connected', d)
        resolve(d)
      }
      this.conn_ts = setTimeout(() => reject(false), this.timeout)
    })
  }
  close(willTerminate = true) {
    this.terminated = willTerminate
    if (this.sock) {
      this.sock.close()
      delete this.sock
      this.sock = null
    }
  }
  conv(str) {
    // console.log('CONV]', str)
    return this.enc.encode(str)
  }
  send(cmd, data) {
    let payload = cmd
    if (data) {
      const tmp = typeof data === 'object' ? JSON.stringify(data) : data
      payload += ` ${tmp.length}\r\n${tmp}\r\n`
    } else {
      payload += '\r\n'
    }
    // console.log('send:', payload)
    this.sock.send(this.conv(payload))
  }
  sendInfo() {
    this.send(`CONNECT ${JSON.stringify(this.opt)}`)
  }
  publish(subject, data = null) {
    this.send(`PUB ${subject}`, data)
  }
  subscribe(subject, cb = null) {
    this.sid++
    this.hash[subject] = this.sid
    if (cb) {
      const callback = typeof cb === 'function' ? cb : () => cb
      this.subs[this.sid] = {cb: callback, recv: false}
    }
    this.send(`SUB ${subject} ${this.sid}`)
  }
  request(subject, data) {
    this.send(`PUB ${subject} INBOX#${this.rid}`, data)

    return new Promise((resolve, reject) => {
      const ts = setTimeout(() => reject(false), 3000)
      this.subscribe(`INBOX#${this.rid}`, (subject, data) => {
        clearTimeout(ts)
        resolve(data)
        return false
      })
      this.unsubscribe(`INBOX#${this.rid}`, 1)
      this.rid++
    })
  }
  respond(m, data) {
    this.send(`PUB ${m[4]}`, data)
  }
  checkRecv(sid) {
    if (this.subs[sid]) {
      if (this.subs[sid].count) {
        this.subs[sid].count--
        if (this.subs[sid].count > 1) return
        else {
          const key = Object.keys(this.hash).find(key => this.hash[key] === sid)
          delete this.subs[sid]
          delete this.hash[key]
          // if (hash.length>0) delete
        }
      }
    }
  }
  unsubscribe(subject, count = 0) {
    if (this.hash[subject]) {
      let cmd = `UNSUB ${this.hash[subject]}`
      if (count > 0) {
        cmd += ` ${count}`
        this.subs[this.hash[subject]].count = count
      } else {
        delete this.subs[this.hash[subject]]
        delete this.hash[subject]
      }
      this.send(cmd)
    }
  }
  setEvents(s) {
    s.onopen = () => {
      this.isConnected = true
      if (this.conn_ts) {
        clearTimeout(this.conn_ts)
      }
      if (this.cb) {
        this.cb(true)
      }
      if (this.onOpen) {
        this.onOpen({
          req: s._socket.remoteAddress,
        })
      }
      this.sendInfo()
    }

    s.onclose = e => {
      this.isConnected = false
      console.log('closed', e)
      if (this.onClose) this.onClose(this.terminated)
      if (!this.terminated) {
        console.log('reconnect')
        setTimeout(() => {
          this.connect()
        }, 2000)
      }
    }

    s.onerror = err => {
      console.error('NATS]', err)
      if (this.onError) this.onError(err)
    }

    s.onmessage = async e => {
      // console.log('M]', this.inbound, e.data)
      if (this.inbound) {
        // this.inbound = Buffer.concat([this.inbound, e.data])
        // this.inbound = [...this.inbound, ...e.data]
        this.inbound = concat([this.inbound, e.data]) // await new Blob([this.inbound, e.data]).arrayBuffer()
      } else {
        this.inbound = e.data
      }
      // console.log('[+]', this.inbound.byteLength)
      while (this.inbound && this.inbound.byteLength > 0) {
        // console.log(
        //   'wait ',
        //   count++,
        //   this.inbound.byteLength,
        //   this.payload ? this.payload.psize : 0
        // )
        switch (this.state) {
          case STATE.WAIT_MSG:
            {
              // console.log('process msg')
              let data = Buffer.from(this.inbound).toString('utf-8')
              // console.log('R]', e, data.length)
              const msg = await this.parse(data)
              console.log('-->', msg.command, msg.subject)
              const psize = msg.size
              // if (psize >= this.inbound.byteLength) {
              //   this.inbound = null
              // } else {
              this.inbound = this.inbound.slice(psize)
              // }
              if (this.inbound.byteLength === 0) this.inbound = null
              // console.log(
              //   '-]',
              //   this.inbound ? this.inbound.byteLength : 0,
              //   psize
              // )
              switch (msg.cmd) {
                case CMD.PING:
                  this.send('PONG')
                  break
                case CMD.INFO:
                  console.log('INFO]', msg.param)
                  break
                case CMD.MSG:
                  {
                    this.payload = msg
                    // this.payload.psize = this.payload.size //CR_LF_LEN;
                    this.payload.size = this.payload.psize
                    this.payload.psize = this.payload.psize + 2 // CR_LF_LEN;
                    // this.inbound.slice(2) // remove CRLF
                    this.state = STATE.WAIT_PAYLOAD
                  }
                  break
              }
            }
            break
          case STATE.WAIT_PAYLOAD:
            {
              // console.log(
              //   'process payload',
              //   this.inbound.byteLength,
              //   this.payload.psize
              // )
              if (this.inbound.byteLength < this.payload.psize) {
                if (undefined === this.payload.chunks) {
                  this.payload.chunks = []
                  this.payload.recved = 0
                }
                this.payload.chunks.push(this.inbound)
                this.payload.psize -= this.inbound.byteLength
                this.payload.recved += this.inbound.byteLength
                // console.log(
                //   '-C]',
                //   this.inbound.byteLength,
                //   this.payload.psize,
                //   this.payload.recved
                // )
                this.inbound = null
                return
              }
              let msg = this.inbound
              if (this.payload.chunks) {
                // console.log('PUSH]', this.payload.psize, this.payload.recved)
                this.payload.chunks.push(
                  this.inbound.slice(0, this.payload.psize),
                )

                msg = concat(this.payload.chunks)
                // console.log('M]', msg.byteLength, this.payload.size)
                this.payload.msg = Buffer.from(msg).toString('utf-8')
              } else {
                this.payload.msg = Buffer.from(
                  this.inbound.slice(0, this.payload.size),
                ).toString('utf-8')
              }
              // Eat the size of the inbound that represents the message.
              if (this.inbound.byteLength === this.payload.psize) {
                // console.log(
                //   '-P]',
                //   this.inbound.byteLength + 'I',
                //   this.payload.psize
                // )
                this.inbound = null
              } else {
                // console.log(
                //   '-P]',
                //   this.inbound.byteLength + 'I',
                //   this.payload.psize
                // )
                this.inbound = this.inbound.slice(this.payload.psize)
                // console.log('-', this.inbound.byteLength)
                // this.inbound = this.inbound.slice(msg.byteLength)
              }

              // process the message
              // this.processMsg();

              try {
                msg = JSON.parse(this.payload.msg) //await this.parse(this.payload.msg)
              } catch (e) {
                console.error(
                  '-->',
                  Buffer.from(this.payload.msg).toString('utf-8'),
                  e.toString(),
                )
              }

              // const sub = this.subs[this.payload.sid]
              // if (sub) {
              //   const data = await sub.cb(
              //     this.payload.subject,
              //     msg,
              //     this.payload.reply
              //   )
              //   if (this.payload.reply) this.respond(m, data)
              // }

              // Reset
              this.state = STATE.WAIT_MSG
              const p = this.payload
              this.payload = null
              // console.log(
              //   '[FINISH]',
              //   this.inbound ? this.inbound.byteLength : 0,
              //   this.payload
              // )
              if (p.sub) {
                // const data =
                await p.sub.cb(p.subject, msg, p.respond)
                // if (p.respond) p.respond(data)
              } else if (this.onMessage) this.onMessage(p.subject, msg)
            }
            break
        }
      }
    }
  }

  async parse(str) {
    let m
    let param = []
    let cmd = ''
    let subject = ''
    let psize
    let sid
    let reply
    let sub
    let respond = null
    let command = ''
    if ((m = MSG.exec(str)) !== null) {
      command = 'MSG'
      cmd = CMD.MSG
      subject = m[1]
      param = m[6] ? JSON.parse(m[6]) : null
      psize = parseInt(m[5])
      sid = parseInt(m[2])
      sub = this.subs[parseInt(m[2])]
      if (sub) {
        reply = !m[3] || m[3] === undefined
        if (!reply) respond = data => this.respond(m, data)
      }
      //   console.log('M]', m, reply)
      //   const data = await sub.cb(subject, param, reply)
      //   if (!reply) this.respond(m, data)
      // }
    } else if ((m = OK.exec(str)) !== null) {
      command = 'OK'
      cmd = CMD.OK
    } else if ((m = ERR.exec(str)) !== null) {
      command = 'ERR'
      cmd = CMD.ERR
    } else if ((m = PONG.exec(str)) !== null) {
      command = 'PONG'
      cmd = CMD.PONG
    } else if ((m = PING.exec(str)) !== null) {
      command = 'PING'
      cmd = CMD.PING
    } else if ((m = INFO.exec(str)) !== null) {
      command = 'INFO'
      cmd = CMD.INFO
      param = JSON.parse(m[1])
    } else {
      console.log('PARSE ERR]', Buffer.from(str).toString('utf-8'))
      // return {
      //   err: 'err',
      // }
    }
    // console.log('PARSE]', m)
    return {
      cmd,
      param,
      subject,
      respond,
      sid,
      size: m[0].length,
      psize,
      sub,
      command,
    }
  }
}

export default new Nats('wss://nats.highmaru.com')

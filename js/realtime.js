var ES =  function(url) {
  this.conn = new EventSource("http://"+url+"/streamEvent", {withCredentials: true});
  this.send = function(msg) {
    console.log("ajax post with msg "+msg)

    superagent
      .post('http://localhost:9000/vote')
      .send(msg)
      .withCredentials()
      .end(function(res) {
        console.log(res)
      })

  }
  this.onReceive = function(event, cb) {
    this.conn.addEventListener(event, function(e) {
      var data = JSON.parse(e.data)
      cb(data)
    })
    return cb
  }
  this.defaultHandler = function(m) {
    console.log("Receive with no event type", m)
  }
  this.conn.addEventListener('message', this.defaultHandler)
}

var WS = function(url) {
  var self = this
  this.conn = new WebSocket('ws://'+url);
  this.send = function(msg) {
    this.conn.send(JSON.stringify(msg))
  };
  this.cbs = {};
  this.onReceive = function(event, cb) {
    this.cbs[event] = cb
  }
  this.conn.onmessage = function(e) {
    var data = JSON.parse(e.data)
    var cb = self.cbs[data.event]
    if(cb) cb(data)
    else console.log("msg receive with no handler", e)
  }
}
var realtime = {ES: ES, WS: WS}
module.exports = realtime
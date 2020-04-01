module.exports = function Dispatcher (root) {
        
    const _eventStore = new Object();
  
    function Dispatcher () {
    
      this.dispatch = function (event, data, ctxt) {
          if (!_eventStore[event]) return;
          _eventStore[event].map(callback => {
              callback.call(ctxt, data);
          });
      }
    
      this.on = function(event, callback) {
          if (!_eventStore[event]) {
              _eventStore[event] = new Array();
          }
          // if (!callback.name) throw new Error("Anonym function not allowed");
          _eventStore[event].push(callback);
      }
    
      this.off = function (event, callback) {
          if (!_eventStore[event]) return;
          if (!callback) {
            delete _eventStore[event];
            return;
          }
          let index;
          for (let i=0,len=_eventStore[event].length, ownCallback; i<len; i++) {
            ownCallback = _eventStore[event][i];
            if (callback === ownCallback) {
              index = i;
            }
          }
          if (index) !_eventStore[event].splice(index,1);
      }
    }
  
    if (root) {
      let _ = new Dispatcher();
      root.$on = _.on.bind(_);
      root.$off = _.off.bind(_);
      root.$dispatch = _.dispatch.bind(_);
      // void
    } else {
      return new Dispatcher();
    }
  }
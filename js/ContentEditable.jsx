var React = require('react')

var ContentEditable = React.createClass({
  getInitialState: function() {
    return {value: this.props.children};
  },
  render: function(){
    var self = this;
    return this.transferPropsTo(
      <span
        onInput={this.emitChange}
        contentEditable
        dangerouslySetInnerHTML={{__html: this.props.html}}></span>
    );
  },
  shouldComponentUpdate: function(nextProps){
    return nextProps.html !== this.getDOMNode().innerHTML;
  },
  emitChange: function(e){
    var html = this.getDOMNode().innerHTML;
    if (this.props.onChange && html !== this.lastHtml) {

      this.props.onChange({
        target: {
          id: e.target.id,
          value: html
        }
      });
    }
    this.lastHtml = html;
  }
});

module.exports = ContentEditable;
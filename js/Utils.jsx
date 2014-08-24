var React = require('react'),
    Immutable = require('immutable')

var Reveal = React.createClass({
  propTypes: {
    show    : React.PropTypes.any, //Reveal the only child when show is true
    first   : React.PropTypes.any  //Reveal the first child when first is true else the second
  },
  render: function() {
    if(this.props.show != undefined) {
      return this.props.show ?
             React.addons.cloneWithProps(React.Children.only(this.props.children), this.props)
             : null
    }
    if(this.props.first != undefined) {
      return this.props.first ? this.props.children[0] : this.props.children[1];
    }
    return null;
  }
})

module.exports = {Reveal: Reveal};
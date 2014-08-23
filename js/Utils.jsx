var React = require('react'),
    Immutable = require('immutable')

var Reveal = React.createClass({
  propTypes: {
    show    : React.PropTypes.any,
    first   : React.PropTypes.any
  },
  render: function() {
    if(this.props.show != undefined) {
      return this.props.show ?
             React.addons.cloneWithProps(React.Children.only(this.props.children), this.props)
             : null
    }
    if(this.props.first != undefined) {
      return this.props.first ? this.props.children[0] : this.props.children[1]
    }
    return null
  }
})

module.exports = {Reveal: Reveal}
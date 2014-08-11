var React = require('react/addons');
var superagent = require('superagent')


var AComponent = React.createClass({
  getInitialState: function() {
    return {}
  },
  render: function() {
    return <div>A Component20300</div>
  }
})

React.renderComponent(
  <AComponent/>,
  document.getElementById('app')
);
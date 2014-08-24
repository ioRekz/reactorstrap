var React = require('react')

var Draggable = React.createClass({
  getInitialState: function() {
    return {};
  },
  onDragStart: function(e) {
    //e.preventDefault()
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.dropEffect = 'copy';
    this.props.onDragStart(e);
  },

  render: function() {
    return React.addons.cloneWithProps(React.Children.only(this.props.children), {
      onDragStart: this.onDragStart,
      onDragEnd: this.props.onEnd,
      draggable: true
    });
  }
})

var Droppable = React.createClass({
  getInitialState: function() {
    return {};
  },
  onDragOver: function(e) {
    e.preventDefault();
  },
  handleDragEnter: function(e) {
    e.target.classList.add('over');
  },

  handleDragLeave: function(e) {
    e.preventDefault();
    e.target.classList.remove('over');
  },
  handleDrop: function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.remove('over');
    this.props.onDrop(e);
  },
  render: function() {
    return React.addons.cloneWithProps(this.props.children, {
      onDragOver: this.onDragOver,
      onDragEnter: this.handleDragEnter,
      onDragLeave: this.handleDragLeave,
      onDrop: this.handleDrop
    });
  }
})

module.exports = {Draggable: Draggable, Droppable: Droppable};
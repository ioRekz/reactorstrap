var React     = require('react'),
    Bootstrap = require('react-bootstrap'),
    Draggable       = require('./DragDrop.jsx').Draggable,
    smartDefaults   = require('./smartDefaults.jsx');

var Catalog = React.createClass({
  getInitialState: function() {
    return {};
  },
  basics: ['a', 'div', 'span', 'h1', 'h2', 'p'],
  onSelect: function(k, v) {
    var component = smartDefaults.smartAll(k) || {name: k, props: {}, children: []};
    this.props.onDrag(component);
  },
  regexFilter: function(k) {
    return !this.state.filter || k.search(new RegExp(this.state.filter,'i')) > -1;
  },
  addCatalog: function(catalog, limit, filter) {
    return Object.keys(catalog)
            .filter(function(k) { return filter(k, catalog[k]) })
            .filter(this.regexFilter)
            .sort()
            .slice(0,limit)
            .map(function(k) {
                  var v = catalog[k]
                  return <Draggable onDragStart={this.onSelect.bind(this, k, v)} onEnd={this.props.onDragEnd} key={k}>
                            <li className="list-group-item draggable">
                              {k}
                            </li>
                         </Draggable>
                }, this);
  },
  filter: function(e) {
    this.setState({filter: this.refs.filter.getValue()});
  },
  render: function() {

    var body = document.body,
        html = document.documentElement;

    var height = Math.max( body.scrollHeight, body.offsetHeight,
                          html.clientHeight, html.scrollHeight, html.offsetHeight );
    return <div>
      <Bootstrap.Input type="text" placeholder="filter" onChange={this.filter} ref="filter"/>
      <ul className="list-group" style={{height: height - 100}}>
        {this.addCatalog(React.DOM, 100, function(k, v) {return this.basics.indexOf(k) >= 0}.bind(this))}
        {this.addCatalog(Bootstrap, 100, function(k, v) {return typeof v == "function" && k !== 'Interpolate'})}
      </ul>
    </div>;
  }
})

module.exports = Catalog;
var React           = require('react/addons'),
    superagent      = require('superagent'),
    Immutable       = require('immutable'),
    Bootstrap       = require('react-bootstrap'),
    TreeView        = require('react-treeview'),
    Typeahead       = require('react-typeahead').Typeahead,
    DOM             = React.DOM,
    Grid            = Bootstrap.Grid,
    Row             = Bootstrap.Row,
    Col             = Bootstrap.Col;

var ContentEditable = require('./ContentEditable.jsx'),
    smartDefaults = require('./smartDefaults.jsx');


var assign = function(src, tgt) {
  return Immutable.Map(src).merge(tgt).toJS();
}

var assoc = function(src, k, v) {
  var dumb = {}
  dumb[k] = v
  return assign(src, dumb)
}

var identity = function(t) {
  return function(x) { return t }
}

var Draggable = React.createClass({
  getInitialState: function() {
    return {}
  },
  onDragStart: function(e) {
    //e.preventDefault()
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.dropEffect = 'copy'
    this.props.onDragStart(e)
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
    return {}
  },
  onDragOver: function(e) {
    e.preventDefault()
  },
  handleDragEnter: function(e) {
    e.target.classList.add('over');
  },

  handleDragLeave: function(e) {
    e.preventDefault()
    e.target.classList.remove('over');
  },
  handleDrop: function(e) {
    e.preventDefault()
    e.stopPropagation()
    e.target.classList.remove('over')
    this.props.onDrop(e)
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

var Reveal = React.createClass({
  render: function() {
    return this.props.show ? React.addons.cloneWithProps(this.props.children, this.props) : null
  }
})

var Preview = React.createClass({
  getInitialState: function() {
    return {}
  },
  renderNode: function(tree, idx) {
    if(typeof tree == "string") return tree
    var props    = assign(tree.props, {key: tree.props.key || (tree.name || 'noname') + idx})
    var children = tree.children.map(function(x, y) {
      return this.renderNode(x, y)
    }, this)
    return tree.elem(props, children)
  },
  render: function() {
    return <div className="previewer">
      {this.renderNode(this.props.tree, 0)}
    </div>
  }
})


var TreePreview = React.createClass({
  getInitialState: function() {
    return {}
  },
  drop: function(cursor, e) {
    if(e.target.classList.contains('tree-view_children') || e.target.classList.contains('placeholder'))
      this.addHere(cursor, e)
    else this.replaceHere(cursor, e)
  },
  shouldComponentUpdate: function() {
    //so we have a live contentEditable text that does not trigger a rerender and loose focus
    return document.activeElement.contentEditable !== 'true'
  },
  addHere: function(cursor, e) {
    var newIdx;
    cursor.cursor(['children']).update(function(children) {
        newIdx = children.length
        return children.push(this.props.dragging)
    }.bind(this))
    this.props.addComponent(cursor._keyPath.concat('children').concat(newIdx))
  },
  replaceHere: function(cursor, e) {
    cursor.update(function(compo) {
      return this.props.dragging
    }.bind(this))
    this.props.addComponent(cursor._keyPath)
  },
  selectNode: function(path, e) {
    e.stopPropagation()
    this.props.selectNode(path)
  },
  changeText: function(cursor, e) {
    cursor.update(function(it) {
      return e.target.value
    })
  },
  renderNode: function(cursor) {
    var path = cursor._keyPath
    var self = this
    var tree = cursor.get()
    if(typeof tree == "string")
      return  <ContentEditable key={path+'-span'} onChange={this.changeText.bind(this, cursor)} className='tree-text'>
                {tree}
              </ContentEditable>

    var tree = tree.toJS()
    var label = <Droppable onDrop={this.drop.bind(this, cursor)}>
                  <strong onClick={this.selectNode.bind(this, path)}>{tree.name}</strong>
                </Droppable>

    return <TreeView key={path} defaultCollapsed={false} nodeLabel={label} >
              {tree.children.map(function(c, y) {
                return this.renderNode(cursor.cursor(['children', y]))
              }, this)}
              <Droppable key={path} onDrop={this.drop.bind(this, cursor)}>
                <Reveal show={this.props.dragging}>
                  <div className='placeholder'>add child</div>
                </Reveal>
              </Droppable>
            </TreeView>
  },
  render: function() {
    var self = this
    return <Bootstrap.Panel header="Tree Preview" bsStyle="info">
        {this.renderNode(Immutable.fromJS(this.props.tree).cursor([], function(newt) {
          //?? if update on root cursor, newt is the raw object otherwise it's an Immutable datastruc ??
          var nextTree = newt._root ? newt.toJS() : newt
          self.props.updateTree(nextTree)
        }))}
      </Bootstrap.Panel>
  }
})


var Catalog = React.createClass({
  getInitialState: function() {
    return {}
  },
  basics: ['div', 'span', 'h1', 'h2'],
  onSelect: function(k, v) {
    var component = smartDefaults.smartAll(k) || {name: k, elem: v, props: {}, children: []}
    this.props.onDrag(component)
  },
  regexFilter: function(k) {
    return !this.state.filter || k.search(new RegExp(this.state.filter,'i')) > -1
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
                }, this)
  },
  filter: function(e) {
    this.setState({filter: this.refs.filter.getValue()})
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
    </div>
  }
})

var Configurator = React.createClass({
  getInitialState: function() {
    return {status: {}}
  },
  propsUI: {
    number: 'range',
    string: 'text',
    boolean: 'checkbox'
  },
  newProps: function(k,e) {
    var v = undefined;
    if(e.target.value.length > 0)
      if(e.target.type == 'number' || e.target.type == 'range') v = parseInt(e.target.value)
      else if(e.target.type == 'checkbox') v = e.target.checked
      else v = e.target.value
    this.validateProp(k, v)
    this.props.changeProps(k, v)
  },
  getPropType: function(k) {
    if(!this.props.pureProps) return 'string'
    var against = assoc({}, k, 'test')
    try {
      var validation = this.props.pureProps[k](against, k, "dummy")
      var mbtype = validation instanceof Error ? validation.message.split('`').slice(-2,-1)[0] : 'string'
      mbtype = mbtype == 'dummy' ? eval(validation.message.split('one of ')[1].slice(0, -1)) : mbtype
      return mbtype == 'function' ? 'string' : mbtype
    }
    catch(error) {
      return 'string'
    }
  },
  validateProp: function(k, v) {
    var against = assoc({}, k, v)
    var err;
    if(k == 'className') {
      err = false
    } else {
      var validation = this.props.pureProps[k](against, k, "dummy")
      err = validation instanceof Error
    }
    var status = Immutable.Map(this.state.status).set(k, err).toJS()
    this.setState({status: status})
  },
  render: function() {
    var uiProps = this.props.props ?
        Object.keys(this.props.props).sort().map(function(k) {
          var v = this.props.props[k]
          var propData = this.getPropType(k)
          var inputType = (propData instanceof Array) ? 'select' : this.propsUI[propData]
          var label = inputType == 'range' ? k+ ' (' + v + ')' : k
          return <Bootstrap.Input key={k} type={inputType} bsStyle={this.state.status[k] ? "error" : 'success'}
                                  label={label}
                                  hasFeedback={false} value={v} checked={v}
                                  onChange={this.newProps.bind(this, k)}>

                   {propData instanceof Array && propData.map(function(it) {
                     return <option key={it} value={it}>{it}</option>
                   }, this)}
                 </Bootstrap.Input>
        }, this)
        : <span>No component selected</span>

    return <Bootstrap.Panel header="Configurator" bsStyle="success">
      <form>
        {uiProps}
      </form>
    </Bootstrap.Panel>
  }
})

var Reactor = React.createClass({
  getInitialState: function() {
    return {selected: null, tree: smartDefaults.starter}
  },
  onSelectNodeFromTree: function(path) {
    this.setState({currentPath: path})
  },
  onAddComponent: function(path) {
    this.setState({dragging: false})
    this.setState({currentPath: path})
  },
  onUpdateTree: function(tree) {
    this.setState({tree: tree})
  },
  currentProps: function() {
    var path = this.state.currentPath
    if(!path) return
    return Immutable.fromJS(this.state.tree).getIn(path.concat('props')).delete('key').toJS()
  },
  currentElem: function() {
    var path = this.state.currentPath
    if(!path) return
    return Immutable.fromJS(this.state.tree).getIn(path.concat('elem')).type.propTypes
  },
  onChangeProps: function(k,v) {
    var path = this.state.currentPath
    var newTree = Immutable.fromJS(this.state.tree)
                           .updateIn(path.concat(['props', k]), identity(v)).toJS()
    this.setState({tree: newTree})
  },
  onDrag: function(component) {
    this.setState({dragging: component})
  },
  onDragEnd: function() {
    this.setState({dragging: false})
  },
  render: function() {
    return <div className="container-fluid">
        <Row>
          <Col md={1} className="large-col">
            <Catalog
                      onDrag={this.onDrag}
                      onDragEnd={this.onDragEnd}
                      />
          </Col>
          <Col md={2}>
            <TreePreview tree={this.state.tree}
                         addComponent={this.onAddComponent}
                         selectNode={this.onSelectNodeFromTree}
                         changeText={this.onChangeText}
                         updateTree={this.onUpdateTree}
                         dragging={this.state.dragging}
                         />
          </Col>
          <Col md={7}>
            <Preview tree={this.state.tree} root={this.state.root}/>
          </Col>
          <Col md={2}>
            <Configurator props={this.currentProps()}
                          pureProps={this.currentElem()}
                          changeProps={this.onChangeProps}
                          />
          </Col>
        </Row>
    </div>
  }
})

React.renderComponent(
  <Reactor/>,
  document.getElementById('app')
);
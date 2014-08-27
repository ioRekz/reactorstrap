var React           = require('react'),
    Immutable       = require('immutable'),
    Bootstrap       = require('react-bootstrap'),
    ContentEditable = require('./ContentEditable.jsx'),
    TreeView        = require('react-treeview'),
    Reveal          = require('./Utils.jsx').Reveal,
    _               = require('lodash'),
    utils           = require('./utils'),
    entities = require("entities"),
    Droppable       = require('./DragDrop.jsx').Droppable;

var TreePreview = React.createClass({
  getInitialState: function() {
    return {selected: null, tree: this.props.tree};
  },
  componentDidUpdate: function() {
    var editing = document.getElementById(this.props.editing)
    if(editing) utils.setEndOfContenteditable(editing)
  },
  drop: function(cursor, e) {
    if(e.target.classList.contains('tree-view_children') || e.target.classList.contains('placeholder'))
      this.addHere(cursor, e);
    else this.replaceHere(cursor, e);
  },
  addHere: function(cursor, e) {
    var newIdx;
    cursor.cursor(['children']).update(function(children) {
        newIdx = children.length;
        return children.push(this.props.dragging);
    }.bind(this));
    this.props.addComponent(cursor._keyPath.concat('children').concat(newIdx));
  },
  replaceHere: function(cursor, e) {
    cursor.update(function(compo) {
      return this.props.dragging;
    }.bind(this));
    this.props.addComponent(cursor._keyPath);
  },
  removeNode: function(cursor, parent, e) {
    console.log('remove', cursor)
    parent.cursor(['children']).update(function(children) {
      return children.delete(cursor._keyPath[cursor._keyPath.length-1]);
    }.bind(this));
    this.props.addComponent(undefined);
  },
  selectNode: function(path, e) {
    e.stopPropagation();
    this.props.selectNode(path);
  },
  changeText: function(cursor, e) {
    this.props.addEditing(e.target.id)
    cursor.update(function(it) {
      return entities.decodeHTML(e.target.value);
    })
  },
  noEdit: function(e) {
    this.props.addEditing(undefined)
  },
  renderNode: function(cursor, parent) {
    var path = cursor._keyPath;
    var self = this;
    var tree = cursor.get();
    if(typeof tree == "string")
      return  <ContentEditable html={tree} id={path} key={path+'-span'}
                               onChange={this.changeText.bind(this, cursor)} onBlur={this.noEdit} className='tree-text'/>
    var tree = tree.toJS();
    var label = <Droppable onDrop={this.drop.bind(this, cursor)}>
                  <div className='remove-wrapper'>
                    <strong onClick={this.selectNode.bind(this, path)}
                            style={{color: _.isEqual(path, this.props.selectedPath) ? 'green' : 'black'}}>
                      {tree.name}
                    </strong>
                    <Bootstrap.Glyphicon onClick={this.removeNode.bind(this, cursor, parent)} className='remove-tree' glyph='remove'/>
                  </div>
                </Droppable>

    return <TreeView key={path} defaultCollapsed={false} nodeLabel={label}>
              {tree.children.map(function(c, y) {
                return this.renderNode(cursor.cursor(['children', y]), cursor)
              }, this)}
              <Droppable key={path} onDrop={this.drop.bind(this, cursor)}>
                <Reveal show={this.props.dragging}>
                  <div className='placeholder'>add child</div>
                </Reveal>
              </Droppable>
            </TreeView>
  },
  render: function() {
    var self = this;
    var rootCursor = Immutable.fromJS(this.props.tree).cursor([], function(newt) {
      //?? if update on root cursor, newt is the raw object otherwise it's an Immutable datastruc ??
      var nextTree = newt._root ? newt.toJS() : newt;
      //remove nulls for nodeRemove

      this.props.updateTree(nextTree);
    }.bind(this));
    return <Bootstrap.Panel header="Tree Preview" bsStyle="info">
        {this.renderNode(rootCursor)}
      </Bootstrap.Panel>
  }
})

module.exports = TreePreview;
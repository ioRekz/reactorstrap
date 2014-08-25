var React           = require('react'),
    Immutable       = require('immutable'),
    Bootstrap       = require('react-bootstrap'),
    ContentEditable = require('./ContentEditable.jsx'),
    TreeView        = require('react-treeview'),
    Reveal          = require('./Utils.jsx').Reveal,
    Droppable       = require('./DragDrop.jsx').Droppable;

var TreePreview = React.createClass({
  getInitialState: function() {
    return {};
  },
  drop: function(cursor, e) {
    if(e.target.classList.contains('tree-view_children') || e.target.classList.contains('placeholder'))
      this.addHere(cursor, e);
    else this.replaceHere(cursor, e);
  },
  shouldComponentUpdate: function() {
    //so we have a live contentEditable text that does not trigger a rerender and loose focus
    return document.activeElement.contentEditable !== 'true';
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
    cursor.cursor([]).update(function(compo) {
      console.log(compo)
      return this.props.dragging;
    }.bind(this));
    this.props.addComponent(cursor._keyPath);
  },
  selectNode: function(path, e) {
    e.stopPropagation();
    this.props.selectNode(path);
  },
  changeText: function(cursor, e) {
    cursor.update(function(it) {
      return e.target.value;
    })
  },
  renderNode: function(cursor) {
    var path = cursor._keyPath;
    var self = this;
    var tree = cursor.get();
    if(typeof tree == "string")
      return  <ContentEditable key={path+'-span'} onChange={this.changeText.bind(this, cursor)} className='tree-text'>
                {tree}
              </ContentEditable>
    var tree = tree.toJS();
    var label = <Droppable onDrop={this.drop.bind(this, cursor)}>
                  <div className='remove-wrapper'>
                    <strong onClick={this.selectNode.bind(this, path)}>{tree.name}</strong>
                    <Bootstrap.Glyphicon className='remove-tree' glyph='remove'/>
                  </div>
                </Droppable>

    return <TreeView key={path} defaultCollapsed={false} nodeLabel={label}>
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
    var self = this;
    var rootCursor = Immutable.fromJS(this.props.tree).cursor([], function(newt) {
      //?? if update on root cursor, newt is the raw object otherwise it's an Immutable datastruc ??
      var nextTree = newt._root ? newt.toJS() : newt;
      self.props.updateTree(nextTree);
    });
    return <Bootstrap.Panel header="Tree Preview" bsStyle="info">
        {this.renderNode(rootCursor)}
      </Bootstrap.Panel>
  }
})

module.exports = TreePreview;
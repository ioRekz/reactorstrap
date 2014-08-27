var React     = require('react'),
    Immutable = require('immutable'),
    Bootstrap = require('react-bootstrap'),
    utils    = require('./utils'),
    Reveal   = require('./Utils.jsx').Reveal,
    assign   = utils.assign,
    assoc    = utils.assoc,
    identity = utils.identity;

var Configurator = React.createClass({
  getInitialState: function() {
    return {status: {}};
  },
  propsUI: {
    number: 'range',
    string: 'text',
    boolean: 'checkbox'
  },
  newProps: function(k,e) {
    var v = undefined;
    if(e.target.value.length > 0)
      if(e.target.type == 'number' || e.target.type == 'range') v = parseInt(e.target.value);
      else if(e.target.type == 'checkbox') v = e.target.checked;
      else v = e.target.value;
    this.validateProp(k, v);
    this.props.changeProps(k, v);
  },
  getPropType: function(k) {
    //ugly message parsing to discover prop type
    if(!this.props.pureProps) return 'string';
    var against = assoc({}, k, 'test');
    try {
      var validation = this.props.pureProps[k](against, k, "dummy");
      var mbtype = validation instanceof Error ? validation.message.split('`').slice(-2,-1)[0] : 'string';
      mbtype = mbtype == 'dummy' ? eval(validation.message.split('one of ')[1].slice(0, -1)) : mbtype;
      return mbtype == 'function' ? 'string' : mbtype;
    }
    catch(error) {
      return 'string';
    }
  },
  validateProp: function(k, v) {
    var against = assoc({}, k, v);
    var err;
    if(k == 'className') {
      err = false;
    } else {
      if(!this.props.pureProps || !this.props.pureProps[k]) return;
      var validation = this.props.pureProps[k](against, k, "dummy");
      err = validation instanceof Error;
    }
    var status = Immutable.Map(this.state.status).set(k, err).toJS();
    this.setState({status: status});
  },
  moveHistory: function(e) {
    this.props.moveHistory(parseInt(e.target.value));
  },
  render: function() {
    var uiProps;
    if(this.props.props)
      uiProps = Object.keys(this.props.props).sort().map(function(k) {
                        var v = this.props.props[k];
                        var propData = this.getPropType(k);
                        var inputType = (propData instanceof Array) ? 'select'
                                                                    : this.propsUI[(typeof v == 'boolean' ? 'boolean' : propData)];
                        var label = inputType == 'range' ? k+ ' (' + v + ')' : k;
                        return <Bootstrap.Input key={k} type={inputType} bsStyle={this.state.status[k] ? "error" : 'success'}
                                                label={label}
                                                hasFeedback={false} value={v} checked={v}
                                                onChange={this.newProps.bind(this, k)}>

                                 {propData instanceof Array && propData.sort().map(function(it) {
                                   return <option key={it} value={it}>{it}</option>
                                 }, this)}
                               </Bootstrap.Input>
                    }, this)
    //else uiProps = <span>Select a component in the tree</span>
    var currentHistory = this.props.currentHistory+1
    var selection = this.props.currentName ?  " - " + this.props.currentName : ''
    return <div>
            <Bootstrap.Panel header={"Configurator"+selection} bsStyle="success">
              <form>
                <Reveal first={this.props.props != undefined}>
                  <div>
                    {uiProps}
                  </div>
                  <span>Select a component in the tree</span>
                </Reveal>
              </form>
            </Bootstrap.Panel>
            <Bootstrap.Panel header="Tools" bsStyle="primary">
              <Bootstrap.Input type='range' ref='history' label={'history '+'('+currentHistory+'/'+this.props.history.length+')'}
                               min={0} max={this.props.history.length-1} value={this.props.currentHistory}
                               onChange={this.moveHistory}/>
              <Bootstrap.Button bsStyle='primary' onClick={this.props.fullscreen} block={true}>Full Preview (Esc to quit)</Bootstrap.Button>
            </Bootstrap.Panel>
          </div>
  }
})

module.exports = Configurator;
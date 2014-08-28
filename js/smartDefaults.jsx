var Immutable  = require('immutable'),
    Bootstrap  = require('react-bootstrap'),
    DOM        = require('react').DOM,
    React      = require('react'),
    utils      = require('./utils'),
    assign     = utils.assign;

var ButtonGroup    = Bootstrap.ButtonGroup,
    Button         = Bootstrap.Button,
    Alert          = Bootstrap.Alert,
    Badge          = Bootstrap.Badge,
    Label          = Bootstrap.Label,
    PageHeader     = Bootstrap.PageHeader,
    Well           = Bootstrap.Well,
    Table          = Bootstrap.Table,
    Glyphicon      = Bootstrap.Glyphicon,
    Input          = Bootstrap.Input,
    Jumbotron      = Bootstrap.Jumbotron,
    Grid           = Bootstrap.Grid,
    TabbedArea     = Bootstrap.TabbedArea,
    Pager          = Bootstrap.Pager,
    Navbar         = Bootstrap.Navbar,
    Nav            = Bootstrap.Nav,
    OverlayTrigger = Bootstrap.OverlayTrigger,
    Row            = Bootstrap.Row,
    Col            = Bootstrap.Col,
    PageItem       = Bootstrap.PageItem,
    TabPane        = Bootstrap.TabPane,
    NavItem        = Bootstrap.NavItem,
    DropdownButton = Bootstrap.DropdownButton,
    ProgressBar    = Bootstrap.ProgressBar,
    Popover        = Bootstrap.Popover,
    Tooltip        = Bootstrap.Tooltip,
    Modal          = Bootstrap.Modal,
    ModalTrigger   = Bootstrap.ModalTrigger,
    Accordion      = Bootstrap.Accordion,
    Panel          = Bootstrap.Panel,
    PanelGroup     = Bootstrap.PanelGroup,
    ButtonToolbar  = Bootstrap.ButtonToolbar,
    SplitButton    = Bootstrap.SplitButton,
    MenuItem       = Bootstrap.MenuItem;

/* Default props and children for components */
var smarties = [
  <h1>h1</h1>,
  <h2>h2</h2>,
  <div>simple div</div>,
  <span>span</span>,
  <p>paragraph</p>,
  <a href='link'>link</a>,

  <Button>Button</Button>,

  <Alert bsStyle="info">
    Alert
  </Alert>,

  <Badge>42</Badge>,

  <Label>Label</Label>,

  <PageHeader>Example page header <small>Subtext for header</small></PageHeader>,

  <Well>Look I'm in a well!</Well>,

  <Glyphicon glyph="star" />,

  <Table striped bordered condensed hover>
    <thead>
      <tr>
        <th>#</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Username</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Mark</td>
        <td>Otto</td>
        <td>@mdo</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Jacob</td>
        <td>Thornton</td>
        <td>@fat</td>
      </tr>
      <tr>
        <td>3</td>
        <td colSpan="2">Larry the Bird</td>
        <td>@twitter</td>
      </tr>
    </tbody>
  </Table>,

  <Input
    type="text"
    placeholder="Enter text"
    label="Working example with validation"/>,

  <Jumbotron>
    <h1>Hello, world!</h1>
    <p>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
    <p><Button bsStyle="primary">Learn more</Button></p>
  </Jumbotron>,


  <Grid fluid={true}>
    <Row className="show-grid">
      <Col xs={12} md={8}><code>&lt;{'Col xs={12} md={8}'} /&gt;</code></Col>
      <Col xs={6} md={4}><code>&lt;{'Col xs={6} md={4}'} /&gt;</code></Col>
    </Row>

    <Row className="show-grid">
      <Col xs={6} md={4}><code>&lt;{'Col xs={6} md={4}'} /&gt;</code></Col>
      <Col xs={6} md={4}><code>&lt;{'Col xs={6} md={4}'} /&gt;</code></Col>
      <Col xs={6} md={4}><code>&lt;{'Col xs={6} md={4}'} /&gt;</code></Col>
    </Row>

    <Row className="show-grid">
      <Col xs={6} xsOffset={6}><code>&lt;{'Col xs={6} xsOffset={6}'} /&gt;</code></Col>
    </Row>

    <Row className="show-grid">
      <Col md={6} mdPush={6}><code>&lt;{'Col md={6} mdPush={6}'} /&gt;</code></Col>
      <Col md={6} mdPull={6}><code>&lt;{'Col md={6} mdPull={6}'} /&gt;</code></Col>
    </Row>
  </Grid>,

  <Pager>
    <PageItem href="#">Previous</PageItem>
    <PageItem href="#">Next</PageItem>
  </Pager>,

  <TabbedArea defaultActiveKey={1} bsStyle='tabs'>
    <TabPane key={1} tab="Tab 1">TabPane 1 content</TabPane>
    <TabPane key={2} tab="Tab 2">TabPane 2 content</TabPane>
  </TabbedArea>,

  <Navbar>
    <Nav>
      <NavItem key={1} href="#">Link</NavItem>
      <NavItem key={2} href="#">Link</NavItem>
      <DropdownButton key={3} title="Dropdown">
        <MenuItem key="1">Action</MenuItem>
        <MenuItem key="2">Another action</MenuItem>
        <MenuItem key="3">Something else here</MenuItem>
        <MenuItem divider />
        <MenuItem key="4">Separated link</MenuItem>
      </DropdownButton>
    </Nav>
  </Navbar>,

  <Nav bsStyle="pills" activeKey={1}>
    <NavItem key={1} href="/home">NavItem 1 content</NavItem>
    <NavItem key={2} title="Item">NavItem 2 content</NavItem>
    <NavItem key={3} disabled={true}>NavItem 3 content</NavItem>
  </Nav>,

  <ProgressBar now={60} label="%(percent)s%" />,

  <OverlayTrigger trigger="click" placement="left" overlay={<Popover title="Popover left"><strong>Holy guacamole!</strong> Check this info.</Popover>}>
    <Button bsStyle="default">Holy guacamole!</Button>
  </OverlayTrigger>,

  <Tooltip placement="right" positionLeft={150} positionTop={50}>
    <strong>Holy guacamole!</strong> Check this info.
  </Tooltip>,

  <Popover placement="right" positionLeft={200} positionTop={50} title="Popover right">
    And here's some <strong>amazing</strong> content. It's very engaging. right?
  </Popover>,

  <Modal title="Modal title"
         backdrop={false}
         animation={false}>
    <div className="modal-body">
      One fine body...
    </div>
    <div className="modal-footer">
      <Button>Close</Button>
      <Button bsStyle="primary">Save changes</Button>
    </div>
  </Modal>,

  <ModalTrigger modal={<Modal title="Modal heading" animation={false}>
                        <div className="modal-body">
                          <h4>Text in a modal</h4>
                          <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
                          <p>lerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
                        </div>
                        <div className="modal-footer">
                          <Button >Close</Button>
                        </div>
                      </Modal>}>
    <Button bsStyle="primary" bsSize="large">Launch demo modal</Button>
  </ModalTrigger>,

  <Accordion>
    <Panel header="Collapsible Group Item #1" key={1}>
      Panel 1
    </Panel>
    <Panel header="Collapsible Group Item #2" key={2}>
      Panel 2
    </Panel>
    <Panel header="Collapsible Group Item #3" key={3}>
      Panel 3
    </Panel>
  </Accordion>,

  <PanelGroup defaultActiveKey={2} accordion>
    <Panel header="Panel 1" key={1}>Panel 1 content</Panel>
    <Panel header="Panel 2" key={2}>Panel 2 content</Panel>
  </PanelGroup>,

  <Panel footer="Panel footer">
    Panel content
  </Panel>,

  <ButtonGroup>
    <Button>Left</Button>
    <Button>Middle</Button>
    <Button>Right</Button>
  </ButtonGroup>,

  {name: 'ButtonToolbar', elem: <ButtonToolbar>
    <ButtonGroup>
      <Button>1</Button>
      <Button>2</Button>
      <Button>3</Button>
      <Button>4</Button>
    </ButtonGroup>

    <ButtonGroup>
      <Button>5</Button>
      <Button>6</Button>
      <Button>7</Button>
    </ButtonGroup>

    <ButtonGroup>
      <Button>8</Button>
    </ButtonGroup>
  </ButtonToolbar>},

  <DropdownButton bsStyle='default' title='Dropdown'>
    <MenuItem key="1">Action</MenuItem>
    <MenuItem key="2">Another action</MenuItem>
    <MenuItem key="3">Something else here</MenuItem>
    <MenuItem divider />
    <MenuItem key="4">Separated link</MenuItem>
  </DropdownButton>,

  <SplitButton bsStyle='default' title='SplitButton'>
    <MenuItem key="1">Action</MenuItem>
    <MenuItem key="2">Another action</MenuItem>
    <MenuItem key="3">Something else here</MenuItem>
    <MenuItem divider />
    <MenuItem key="4">Separated link</MenuItem>
  </SplitButton>

];

var globals = {
  bsSize: 'medium',
  bsStyle: 'default'
};

var defaultProps = function(elem) {
  if(!elem || !elem.type.propTypes) return {};
  return assign(Object.keys(elem.type.propTypes).reduce(function(total, prop) {
    var current = {};
    current[prop] = elem.type.defaultProps ? elem.type.defaultProps[prop] : undefined;
    return assign(total, current);
  }, {}), globals)
};


var findElem = function(name) {
  return Bootstrap[name] || DOM[name];
};

var parseDOM = function(elem, name) {
  if(typeof elem == 'string') return elem;
  var child = elem._store.props.children;
  var children = child instanceof Array ? child.map(function(c) {return parseDOM(c)})
                                        : child ? [parseDOM(child)] : [];
  var name = name || elem.type.displayName;
  var props = Immutable.Map(elem._store.props).delete('children').toJS();
  return {name: name, children: children, props: Immutable.Map(defaultProps(elem)).merge(props).toJS()};
}

var smartDefaults = {
  smartChildren: function(k) {
    if(!smartChildren[k]) return [];
    return parseDOM(smartChildren[k]).children;
  },
  smartProps: function(k) {
    if(!smartChildren[k]) return {};
    return parseDOM(smartChildren[k]).props;
  },
  smartAll: function(k) {
    var elem = Immutable.Sequence(smarties).find(function(e) {
      return e.name ? e.name == k : e.type.displayName == k;
    });
    return elem ? parseDOM(elem.elem || elem, elem.name) : undefined;
  },
  starter: parseDOM(<Jumbotron>
                      <h1>Hello, world!</h1>
                      <p>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
                      <p><Button bsStyle="primary">Learn more</Button></p>
                    </Jumbotron>)
}

module.exports = smartDefaults;
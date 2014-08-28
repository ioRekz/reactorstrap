reactorstrap
============

drag&amp;drop UI Kit for reactorstrap and theorically any other one. [demo](http://youtu.be/EUHkYHIEPik)
![Reactor](http://i60.tinypic.com/2d6lemr.png)

## Implementation
There are 5 main components:

- **Reactor**: the main component

  mainly sync all the children components
  Manage the app tree in its state with the form :
`
{name: 'div', elem: DOM.div, props: {}, children: ['Hi']}
`
  Manage the selected component in the tree for the configurator. Link the drag and drop features between the Catalog and the Tree.


- **Catalog**: the component list on the left

 It takes a hashmap of components with the form {name -> React Component} so the original required react-bootstrap object is just fine. We add some classic React.DOM components like div, span ...


- **Tree Preview**: the tree representation of the app

  It use the amazing chenglou/treeview to render the tree.
  We use some native html5 drag and drop to add or replace components.
  We mark the string children as contenteditable.


- **Preview**: The preview of the app

  We just take the app tree and render it as is.
  5 lines of code


- **Configurator**: Props editor of selected node in the tree

  It takes the selected component as props.
  We then inspect the object to find props.
  We also fake render with bad props so we can guess the prop types from the message :/ and display revelant UI like checkbox for bools.
  We could use gcanti/tcomb-react-bootstrap to read prop types but it would only work for react bootstrap.

## Libraries
Use the new Facebook Immutable library with cursors for deep tree updaptes.
That's a feature I missed from Om. We can update and render deep in the tree quite elegantly.

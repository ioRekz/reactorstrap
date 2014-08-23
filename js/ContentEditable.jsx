var React = require('react')

var ContentEditable = React.createClass({
    getInitialState: function() {
        return {value: this.props.children}
    },
    render: function(){
        var self = this
        return <span
            onInput={this.emitChange}
            contentEditable
            className={this.props.className}>{self.state.value}</span>;
    },
    shouldComponentUpdate: function(nextProps){
        return nextProps.html !== this.getDOMNode().innerHTML;
    },
    emitChange: function(){
        var html = this.getDOMNode().innerHTML;
        if (this.props.onChange && html !== this.lastHtml) {

            this.props.onChange({
                target: {
                    value: html
                }
            });
        }
        this.lastHtml = html;
    }
});

module.exports = ContentEditable
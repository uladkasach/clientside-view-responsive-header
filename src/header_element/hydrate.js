var Dropdown_Handler = require("./dropdown_handler");

var hydrate = function(element, options){
    /*
        hydrate dropdown of this element
    */
    var dropdown_element = element.children[1]; // children[1] == ':scope > div.header_dropdown'
    var dropdown_expander = element.children[0].querySelector(".header_element_dropdown_expand") // children[0] == ':scope > a.header_button'
    var dropdown_arrow = element.children[0].querySelector(".header_element_dropdown_arrow") // children[0] == ':scope > a.header_button'
    var dropdown_handler = new Dropdown_Handler(dropdown_element, dropdown_expander, dropdown_arrow);
    dropdown_element.dropdown_handler = dropdown_handler; // append the handler to the dropdown parent DOM object, so that utility_methods can access dropdown_handler
    element.dropdown_handler = dropdown_handler; // append the handler to the element root DOM

    /*
        set dropdown defaults
    */
    dropdown_handler.update(); // update its understanding of whether it should exist or not
    dropdown_handler.hide_dropdown(); // default view to hidden

    /*
        append utility methods to header elements
    */
    element.show = utility_methods.show.bind(element);
    element.hide = utility_methods.hide.bind(element);
    element.is_visible = utility_methods.is_visible.bind(element);

    // return the hydrated dom
    return element;
}

var utility_methods = {
    show : function(){
        this.style.display = "block"; // update visibility
        var dropdown_handler_exists = (this.parentNode!=null && typeof this.parentNode.dropdown_handler == "object");
        if(dropdown_handler_exists) this.parentNode.dropdown_handler.update(); // ensure parent.dropdown updates; unless is root element, in which case parent does not have dropdown
    },
    hide : function(){
        this.style.display = "none"; // update visibility
        var dropdown_handler_exists = (this.parentNode!=null && typeof this.parentNode.dropdown_handler == "object");
        if(dropdown_handler_exists) this.parentNode.dropdown_handler.update(); // ensure parent.dropdown updates; unless is root element, in which case parent does not have dropdown
    },
    is_visible : function(){
        return (this.style.display!="none");
    }
}

module.exports = hydrate;

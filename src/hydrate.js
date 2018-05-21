var Header_Roller = require("./header_roller");
var Dropdown_Handler = require("./dropdown_handler");

var hydrate = function(dom, options){
    // normalize options
    if(typeof options == "undefined") options = {};
    if(typeof options.min_width == "undefined") options.min_width = 160; // default min width

    // append dropdown handlers to each dropdown
    var menu_element = dom.querySelector(".header_menu_element");
    var potential_dropdowns = dom.querySelectorAll('.header_element');
    potential_dropdowns.forEach(hydrate_dropdown_if_valid);
    menu_element.querySelector(".header_dropdown").style.display=null; // remove dropdown_handler display/hide and let it work on hover as by default

    // append the listener for width changes to update the header
    var left_part = dom.querySelector(".header_side-left");
    var right_part = dom.querySelector(".header_side-right");
    var right_elements = dom.querySelectorAll(".header_side-right > .header_element:not(.header_menu_element)");
    right_elements = Array.from(right_elements); // convert NodeList to array
    var header_roller = new Header_Roller(right_elements, options.min_width, right_part, menu_element, left_part);
    header_roller.listen();
    dom.header_roller = header_roller;

    // return the hydrated dom
    return dom;
}
function hydrate_dropdown_if_valid(potential_dropdown){
    /*
        determine if valid dropdown
    */
    var dropdown_expander = potential_dropdown.querySelector(':scope > a.header_button .header_element_dropdown_expand');
    var dropdown_element = potential_dropdown.querySelector(':scope > div.header_dropdown');
    if(dropdown_element == null) return; // not a valid dropdown


    /*
        attach dropdown handler
            - opens and closes dropdown when dropdown expander is pressed
            - only relevent in nested dropdowns
    */
    var dropdown_handler = new Dropdown_Handler(dropdown_expander, dropdown_element);
    dropdown_expander.onclick = function(event){
        dropdown_handler.toggle();
        event.preventDefault(); // prevent anchor action from firing
    }
    dropdown_handler.hide_dropdown(); // default view to hidden
    dropdown_element.handler = dropdown_handler; // append the handler to the dropdown DOM object
}

module.exports = hydrate;

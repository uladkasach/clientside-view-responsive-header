require("./styles.css");
var Header_Roller = require("./header_roller");
var Dropdown_Handler = require("./dropdown_handler");
var template = {};

module.exports = {
    generate : function(dom, options){
        // header parts
        var right_part = dom.querySelector(".header_side-right");
        var left_part = dom.querySelector(".header_side-left");

        // template elements
        var template_dom = dom.querySelector("template-holder");
        template = {
            header_element : template_dom.querySelector(".header_element"),
            header_components : {
                button : template_dom.querySelector(".header_button"),
                dropdown : template_dom.querySelector(".header_dropdown"),
            },
            basic_structures : {
                line : template_dom.querySelector(".header_dividing_line_element"),
            },
        }

        // append elements to each part
        var left_elements = this.append_elements(left_part, options.left);
        var right_elements = this.append_elements(right_part, options.right);

        // append the menu element to the right part
        var menu_element = this.convert_element_structure({title:"More", elements:[]});
        menu_element.querySelector(".header_dropdown").style.right=0; // ensure does not go outside of page bounds, even if overflowing
        menu_element.querySelector(".header_dropdown").style.display=null; // remove dropdown_handler display/hide and let it work on hover as by default
        right_part.appendChild(menu_element);

        // append the listener for width changes to update the header
        var header_roller = new Header_Roller(right_elements, 160, right_part, menu_element, left_part);
        header_roller.listen();
        dom.header_roller = header_roller;
        //this.attach_listener(right_part, right_elements, menu_element);

        // return DOM
        return dom;
    },
    append_elements : function(parent_node, elements_outline){
        var elements = [];
        elements_outline.forEach(element_structure=>{
            var element = this.convert_structure_to_element(element_structure);
            elements.push(element);
            parent_node.appendChild(element);
        })
        return elements;
    },
    convert_structure_to_element : function(structure){
        if(typeof structure == "object") return this.convert_element_structure(structure);
        if(typeof structure == "string") return this.convert_basic_structure(structure);
    },
    convert_basic_structure : function(identifier){
        return template.basic_structures[identifier].cloneNode(true);
    },
    convert_element_structure : function(structure){
        // evaluate structure
        var dropdown_requested = Array.isArray(structure.elements);

        // define elements in template
        var element = template.header_element.cloneNode(true);

        // determine whether to hover
        if(structure.no_hover === true) element.classList.add("header_element_no_hover");

        /*
            build button
        */
        var button = template.header_components.button.cloneNode(true);
        element.appendChild(button); // append to DOM
        var content_holder = button.querySelector(".header_element_content_holder");
        var dropdown_arrow = button.querySelector(".header_element_dropdown_arrow");
        var dropdown_expander = button.querySelector(".header_element_dropdown_expand");
        if(typeof structure.src == "string"){ // attach src
            button.href = structure.src;
            button.classList.add("header-clickable_button");
        }
        if(typeof structure.title == "string") content_holder.textContent = structure.title; // attach title if defined
        if(typeof structure.html == "string") content_holder.innerHTML = structure.html; // insert html if defined
        if(dropdown_requested){
            dropdown_arrow.style.display="flex"; // display dropdown arrow if dropdown requested (hidden by styles.css depending on nesting)
            dropdown_expander.style.display="flex"; // display dropdown expander if dropdown is requested (hidden by styles.css depending on nesting)
        }

        /*
            build and attach dropdown if requested (recursive);
                - note, that whether the elements are drop down or offset depends on whether they are nested already or not
                - this is controlled in the styles.css sheet
        */
        if(dropdown_requested){
            var dropdown = template.header_components.dropdown.cloneNode(true);
            element.appendChild(dropdown); // attach the element to the dom
            structure.elements.forEach((element_structure)=>{
                var dropdown_element = this.convert_structure_to_element(element_structure);
                dropdown.appendChild(dropdown_element);
            })
        }

        /*
            attach dropdown handler
                - opens and closes dropdown when dropdown expander is pressed
                - only relevent in nested dropdowns
        */
        if(dropdown_requested){
            var dropdown_handler = new Dropdown_Handler(dropdown_expander, dropdown);
            dropdown_expander.onclick = function(event){
                dropdown_handler.toggle();
                event.preventDefault(); // prevent anchor action from firing
            }
            dropdown_handler.hide_dropdown(); // default view to hidden
            dropdown.handler = dropdown_handler; // append the handler to the dropdown DOM object
        }

        // return built element
        return element;
    },
}

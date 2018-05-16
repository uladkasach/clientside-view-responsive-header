require("./styles.css");
var template = {};
var max_width = 200;
var Header_Roller = require("./header_roller");

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
        right_part.appendChild(menu_element);

        // append the listener for width changes to update the header
        var header_roller = new Header_Roller(right_elements, 200, right_part, menu_element);
        header_roller.unwrap_only_x_elements(2);
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
        if(typeof structure.src == "string"){ // attach src
            button.href = structure.src;
            button.classList.add("header-clickable_button");
        }
        if(typeof structure.title == "string") content_holder.textContent = structure.title; // attach title if defined
        if(typeof structure.html == "string") content_holder.innerHTML = structure.html; // insert html if defined
        if(dropdown_requested) dropdown_arrow.style.display="flex"; // display dropdown arrow if dropdown requested

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

        // return built element
        return element;
    },
}

require("./styles.css");
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
        console.log(options); // expect options to be json of header
        this.append_elements(right_part, options.right);
        this.append_elements(left_part, options.left);

        // return DOM
        return dom;
    },
    append_elements : function(parent_node, elements_outline){
        elements_outline.forEach(element_structure=>{
            var element = this.convert_structure_to_element(element_structure);
            console.log(element);
            parent_node.appendChild(element);
        })
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
        var dropdown_requested = Array.isArray(structure.elements) && structure.elements.length > 0;

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
            var dropdown_content_holder = dropdown.querySelector(".header_dropdown-content");
            structure.elements.forEach((element_structure)=>{
                var dropdown_element = this.convert_structure_to_element(element_structure);
                dropdown_content_holder.appendChild(dropdown_element);
            })
        }

        // return built element
        return element;
    },
}

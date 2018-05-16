require("./styles.css");
var template = {};
var max_width = 200;

var Header_Roller = function(all_elements, width_per_element, content_holder, menu_element){
    console.log(content_holder);
    this.all_elements = all_elements;
    this.menu_element = menu_element;
    this.width_per_element = width_per_element;
    this.holders = {
        content : content_holder,
        menu_dropdown : menu_element.querySelector(".header_dropdown"),
    };
}
Header_Roller.prototype = {
    unwrap_only_x_elements : function(elements_to_unwrap){
        // recreate positions each update,
        //      first elements_to_unwrap elements go to always_open
        //      last elements_to_unwrap elements go to menu_element_dropdown
        var unwrapped_elements = this.all_elements.slice(0, elements_to_unwrap);
        var wrapped_elements = this.all_elements.slice(elements_to_unwrap);
        unwrapped_elements.forEach((element)=>{
            this.holders.content.appendChild(element);
        })
        wrapped_elements.forEach((element)=>{
            this.holders.menu_dropdown.appendChild(element);
        })
        console.log(unwrapped_elements);
        console.log(wrapped_elements);

        // append menu element to end
        this.holders.content.appendChild(this.menu_element);

        // if unwrapped_elements = 0, then change menu element title to "Menu";
        if(unwrapped_elements.length == 0){
            this.menu_element.querySelector(".header_element_content_holder").textContent = "Menu";
        } else {
            this.menu_element.querySelector(".header_element_content_holder").textContent = "More";
        }

        // if wrapped_elements = 0, then hide menu element
        if(wrapped_elements.length == 0){
            this.menu_element.style.display = "none";
        } else {
            this.menu_element.style.display = "block";
        }
    },
}

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

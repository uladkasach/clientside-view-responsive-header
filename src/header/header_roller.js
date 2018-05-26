var Header_Roller = function(all_elements, width_per_element, content_holder, menu_element, alternative_holder){
    this.all_elements = all_elements;
    this.menu_element = menu_element;
    this.width_per_element = parseInt(width_per_element);
    this.holders = {
        alternative : alternative_holder, // used to determine how much space is used in the header other than this content
        content : content_holder,
        menu_dropdown : menu_element.querySelector(".header_dropdown"),
    };
    this.target_window = window.root_window; // by default its the root document
}
Header_Roller.prototype = {
    listen : function(){ //attach listener
        this.target_window.addEventListener('resize', (event)=>{ // add on resize listener
            this.update_header_wrapping();
        });
        this.target_window.addEventListener("load", (event)=>{ // add onload resizer
            this.update_header_wrapping();
        });
        this.update_header_wrapping(); // and update now
    },
    define_target_window : function(target_window){
        this.target_window = target_window;
        this.listen();
    },
    update_header_wrapping : function(){
        var elements_to_unwrap = this.determine_elements_to_unwrap();
        this.unwrap_only_x_elements(elements_to_unwrap);
    },
    determine_elements_to_unwrap : function(){
        var browser_width = this.target_window.document.documentElement.clientWidth;
        var alternative_width = this.holders.alternative.clientWidth;
        if(alternative_width == 0) alternative_width = this.holders.alternative.querySelectorAll(".header_element").length * this.width_per_element; // if not rendered yet, just approximate
        var availible_width = browser_width - alternative_width;
        var elements_supportable = Math.floor(availible_width/this.width_per_element);
        var element_space_availible = elements_supportable - 1; // -1 for the "More"/"Menu" element
        if(element_space_availible < 0) element_space_availible = 0;

        // for dev purposes
        var analysis = {
            width_per_element : this.width_per_element,
            browser_width : browser_width,
            alternative_width : alternative_width,
            availible_width : availible_width,
            elements_supportable : elements_supportable,
            element_space_availible : element_space_availible,
        }

        return element_space_availible;
    },
    unwrap_only_x_elements : function(elements_to_unwrap){
        // recreate positions each update,
        //      first elements_to_unwrap elements go to always_open
        //      last elements_to_unwrap elements go to menu_element_dropdown
        var unwrapped_elements = this.all_elements.slice(0, elements_to_unwrap);
        var wrapped_elements = this.all_elements.slice(elements_to_unwrap);
        if(wrapped_elements.length == 1) { // if only wrapping one element, we'd be swapping the element for the more container. just dont wrap it instead
            unwrapped_elements.push(wrapped_elements[0]); // move it back to the unwrapped elements list
            wrapped_elements = []; // empty the wrapped elements list
        }
        unwrapped_elements.forEach((element)=>{
            element.dropdown_handler.auto_dropdown(); // let dropdown state be determined automatically by hover status (because unwrapped)
            this.holders.content.appendChild(element);
        })
        wrapped_elements.forEach((element)=>{
            element.dropdown_handler.hide_dropdown(); // close the dropdown as soon as it goes into the dropdown (because wrapped)
            this.holders.menu_dropdown.appendChild(element);
        })

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
            this.menu_element.dropdown_handler.update(); // update dropdown handler to show that it has dropdown elements
            this.menu_element.dropdown_handler.auto_dropdown(); // ensure that content is shown based on hover
        }
    },
}

module.exports = Header_Roller;

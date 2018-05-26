var Dropdown_Handler = function(dropdown_element, expander_button, hover_down_arrow){
    /*
        define constants
    */
    this.dropdown = dropdown_element;
    this.button = expander_button;
    this.arrow = hover_down_arrow;

    /*
        add functionality to exmander button
    */
    expander_button.onclick = function(event){
        this.toggle();
        event.preventDefault(); // prevent anchor action from firing
    }.bind(this);
}
Dropdown_Handler.prototype = {
    is_dropdown_showing : function(){
        return (this.dropdown.style.display === "block");
    },
    toggle : function(){
        var dropdown_is_showing = this.is_dropdown_showing();
        if(dropdown_is_showing){
            this.hide_dropdown();
        } else {
            this.show_dropdown();
        }
    },
    auto_dropdown : function(){
        this.dropdown.style.display=null; // remove open, close styling set by dropdown handler and let it work on hover
    },
    show_dropdown : function(){
        this.button.querySelector(".dropdown_more").style.display = "none"; // hide "+" if showing
        this.button.querySelector(".dropdown_close").style.display = "block"; // show "x" if showing
        this.dropdown.style.display="block"; // show the dropdown
    },
    hide_dropdown : function(){
        this.button.querySelector(".dropdown_more").style.display = "block"; // show "+" if hiding
        this.button.querySelector(".dropdown_close").style.display = "none"; // hide "x" if hiding
        this.dropdown.style.display="none"; // hide the dropdown
    },
    add_to_dropdown : function(element){
        this.dropdown.appendChild(element);
    },
    update : function(){
        // check if visible child exists
        var children = Array.from(this.dropdown.children);
        var visible_child_exists = false;
        for(var i = 0; i < children.length; i++){
            var child = children[i];
            if(child.style.display == "none") continue;
            visible_child_exists = true;
            break;
        }

        // update ui based on state of child visibility
        if(visible_child_exists){ // if visible child exists, show dropdown UI
            this.button.style.display = "flex"; // hide the dropdown button
            this.arrow.style.display = "flex"; // hide the dropdown arrow
        } else { // else hide dropdown ui
            this.button.style.display = "none"; // hide the dropdown button
            this.arrow.style.display = "none"; // hide the dropdown arrow
        }
    }
}

module.exports = Dropdown_Handler;

var Dropdown_Handler = function(dropdown_parent, dropdown_content, expander_button, hover_down_arrow){
    /*
        define constants
    */
    this.parent = dropdown_parent;
    this.content = dropdown_content;
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
    is_content_showing : function(){
        return (this.content.style.display === "block");
    },
    toggle : function(){
        var content_is_showing = this.is_content_showing();
        if(content_is_showing){
            this.hide_content();
        } else {
            this.show_content();
        }
    },
    auto_content : function(){
        this.content.style.display=null; // remove open, close styling set by dropdown handler and let it work on hover
    },
    show_content : function(){
        this.button.querySelector(".dropdown_more").style.display = "none"; // hide "+" if showing
        this.button.querySelector(".dropdown_close").style.display = "block"; // show "x" if showing
        this.content.style.display="block"; // show the dropdown contents
    },
    hide_content : function(){
        this.button.querySelector(".dropdown_more").style.display = "block"; // show "+" if hiding
        this.button.querySelector(".dropdown_close").style.display = "none"; // hide "x" if hiding
        this.content.style.display="none"; // hide the dropdown contents
    },
    add_to_dropdown : function(element){
        this.content.appendChild(element);
    },
    update : function(){
        // check if visible child exists
        var children = Array.from(this.content.children);
        var visible_child_exists = false;
        for(var i = 0; i < children.length; i++){
            var child = children[i];
            if(child.style.display == "none") continue;
            visible_child_exists = true;
            break;
        }

        // update ui based on state of child visibility
        if(visible_child_exists){ // if visible child exists, show dropdown UI
            this.parent.style.display = "block"; // show dropdown element
            this.button.style.display = "flex"; // hide the dropdown button
            this.arrow.style.display = "flex"; // hide the dropdown arrow
        } else { // else hide dropdown ui
            this.parent.style.display = "none"; // hide dropdown element
            this.button.style.display = "none"; // hide the dropdown button
            this.arrow.style.display = "none"; // hide the dropdown arrow
        }
    }
}

module.exports = Dropdown_Handler;

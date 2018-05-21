process.env.src_root = __dirname + "/../src";
process.env.node_modules_root = __dirname + "/../node_modules";
process.env.test_env_root = __dirname + "/_env"

/*
    load testing dependencies
*/
var jsdom = require("jsdom");
var xmlhttprequest = require("xmlhttprequest");
var assert = require("assert");

/*
    provision environment to mimic browser environment - for clientside require
    - provision the window (specifically document & location)
        - provision the xmlhttprequest in the window as well
*/
global.window = new jsdom.JSDOM(``,{
    url: "file:///",
    resources: "usable", // load iframes and other resources
    runScripts : "dangerously", // enable loading of scripts - dangerously is fine since we are running code we wrote.
}).window;
window.XMLHttpRequest = xmlhttprequest.XMLHttpRequest; // append XMLHttpRequest to window

/*
    load the clientside_require module
*/
window.node_modules_root = process.env.node_modules_root;
require("clientside-require"); // initializes clientside_require into the `window` global object

/*
    begin testing
*/
describe('basic', function(){
    it('should be loadable with clientside_require', async function(){
        var view_loader = await window.clientside_require.asynchronous_require("clientside-view-loader");
        var build = await view_loader.load(process.env.src_root);
    })
    it('should be buildable', async function(){
        var view_loader = await window.clientside_require.asynchronous_require("clientside-view-loader");
        var build = await view_loader.load(process.env.src_root);
        var dom = await build({left:[{"title":"test", "elements":[{"title":"test"}]}], right:[]});
    })
})
describe('dropdown_handler', function(){
    it('should determine whether dropdown is open successfully')
    it('should be able to close dropdown')
    it('should be able to open dropdown')
    it('should be able to toggle dropdown')
})
describe('header_roller', function(){
    it('should be able to determine how much space there is availible in the header for elements accurately')
    it('should determine how many elements there is space for, unwrapped, in the header accurately')
    it('should move first X elements into header and last ALL-X elements into the wrapped dropdown, based on dynamic X')
    it('should remove display style from unwrapped element dropdowns, so that on hover menus open')
    it('should hide the dropdowns if the elements are wrapped, by default')
    it('should hide menu element if no elements are wrapped')
    it('should rename menu element title to `more` if some elements are unwrapped')
    it('should rename menu element title to `menu` if all elements are wrapped')
})
describe('compiler', function(){
    describe('basic_structures', function(){
        it('should be able to generate a `line` element')
    })
    describe('full_elements', function(){
        it('should understand the `title` parameter') // textContent
        it('should understand the `html` parameter') // innerHTML
        it('should understand the `elements` parameter') // insert these elements into its dropdown, add dropdown handler and dropdown dom
    })
    describe('user experience', function(){
        it('should look good - check this manually')
    })
})

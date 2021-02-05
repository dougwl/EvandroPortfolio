//Some new tests
class FieldValidation{

    constructor(){
        this.fieldsList = {};
        this.lastInFocus = '';
        this.displayingTooltip = false;
        this.dismissed = ''; // Indicates when pop up is dismissed.
    }

/*     'use strict'; */
    CheckOn(event, nodeObj, message, timeOut = 530){

        let name = nodeObj.name;
        let t = timeOut;
        let msg = message;
        let instance = this;

        let ClosePopUp = () => {  /// Problema
            if(document.activeElement.getAttribute('name') == name ){
                nodeObj.blur();
                nodeObj.focus();
            }
        };
        let SetTimer = (time) => {
            let tt = (time != undefined) ? time : t;
            this.fieldsList[name].status = 'on';
            this.fieldsList[name].controller = setTimeout(() => {this.IsValid(name,msg);} ,tt);
        }
        let CloseOnOutOfFocus = () => {
            let events = ['scroll','click'];
            let removeAfterUsed =  (evt) => {
                    if((evt.type == 'scroll' || evt.type == 'click')){
                        if(name == instance.lastInFocus && instance.fieldsList[name].status == 'off'){
                            nodeObj.blur();
                            if(evt.target.tagName == 'BUTTON'){
                                evt.preventDefault();
                                evt.target.click();
                            }
                        }
                        else instance.StopThis(name);
                        instance.dismissed = true;
                        for (const ev of events) {
                            document.removeEventListener(ev, removeAfterUsed, true);
                        }
                    }
            }
            for (const event of events) {
                document.addEventListener(event, removeAfterUsed, true );
            }
        }
        this.lastInFocus = name;
        this.displayingTooltip = false;
        if(!(name in this.fieldsList)){
            let newField = {[name]: {obj: nodeObj, msg: '', controller: null, status:'off'} };
            this.fieldsList = {...this.fieldsList, ...newField};
            if(nodeObj.value != '') SetTimer();
        }
        else if(event.type == 'input' && event.inputType == 'deleteContentBackward'){
            if(nodeObj.value != ''){
                if(this.fieldsList[name].status == 'on') {
                    this.StopThis(name);
                }
                else ClosePopUp();
                SetTimer(720);
            }
            else {
                if(this.fieldsList[name].status == 'off') ClosePopUp();
                this.fieldsList[name].obj.removeAttribute('isvalid');
            }
        }
        else if(this.fieldsList[name].status == 'off' && nodeObj.value != ''){
            ClosePopUp();
            SetTimer();
        }
        else if(nodeObj.value != ''){
            this.StopThis(name);
            SetTimer();
        }
        if(this.dismissed == '' || this.dismissed == true){
            CloseOnOutOfFocus();
            this.dismissed = false;
        }
        this.fieldsList[name].obj.setCustomValidity('');
        this.fieldsList[name].obj.setAttribute('isvalid', true);
    }

    /* 'use strict'; */
    StopAll(){
        let controller;
        let fieldName;
        for (const field in this.fieldsList) {
            fieldName = field.name;
            if (fieldName in this.fieldsList) {
                if(this.fieldsList[fieldName].controller != null){
                    clearTimeout(this.fieldsList[fieldName].controller);
                    this.fieldsList[fieldName].controller = null;
                    this.fieldsList[fieldName].status = 'off';
                }
            }
        }
    }

    /* 'use strict'; */
    StopThis(obj){
        if(obj in this.fieldsList && this.fieldsList[obj].controller != null){
            clearTimeout(this.fieldsList[obj].controller);
            this.fieldsList[obj].controller = null;
            this.fieldsList[obj].status = 'off';
        }
    }


    /* 'use strict'; */
    IsValid(objName,message){

        let field = this.fieldsList[objName];

        let isInViewport = (elem) => {
            let bounding = elem.getBoundingClientRect();
            return (
                bounding.top >= 0 &&
                bounding.left >= 0 &&
                bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        };

        if(field.obj.value != '' && field.obj.checkValidity() == false){
            if(field.msg == ''){
                field.msg = message;
                field.obj.setCustomValidity(message);
            }
            if(document.activeElement.name == objName || document.activeElement.tagName == 'BODY' && this.lastInFocus == objName){
                if(isInViewport(field.obj) && field.obj.value != ''){
                    field.obj.reportValidity();
                }
                this.displayingTooltip = true;
            }
            field.controller = null;
            field.status = 'off';
            field.msg = '';
            field.obj.setAttribute('isvalid', false);
        }
        else if(field.obj.value == ''){
            field.controller = null;
            field.status = 'off';
            field.msg = '';
        }
    }

    /* 'use strict'; */
    ListenToField({nodeList, type = '', customMessage = '', tooltipTime = ''} = {}){
        let inputHandler;

        let assignToEvents = (element) => {
            let message = customMessage;
            if(element.type == type || type == '' ){
                if(element.tagName == 'INPUT' && element.type != 'hidden' && !element.id.includes('botcheck')){
                    if(message == ''){
                        if(element.hasAttribute('tooltip')){
                            message = element.getAttribute('tooltip');
                        }
                        else console.warn('No message defined, using default tooltip.');
                    }
                    if(!element.hasAttribute('inputType')){
                        element.addEventListener('input', (evt) => {
                                this.CheckOn(evt, element, message, tooltipTime != '' ? tooltipTime : undefined)
                            }
                        );
                    }
                    else if(element.getAttribute('inputType') == 'calendar') {
                        element.addEventListener('blur', (evt) => {
                                this.CheckOn(evt, element, message, tooltipTime != '' ? tooltipTime : undefined)
                            }
                        );
                    }
                    element.form.addEventListener('submit', (ev) => {
                            if(element.value == ''){
                                element.setAttribute('required','');
                                element.setCustomValidity('Este campo é obrigatório!');
                                ev.stopPropagation();
                                ev.preventDefault();
                                element.reportValidity();
                            }
                        }
                    );
                }
            }
            else{
                throw console.error("Type is invalid.");
                return;
            }
        }

        if(nodeList != undefined || nodeList != null){
            inputHandler = nodeList;
        }
        else {
            throw console.error('Node list is empty!');
            return;
        }

        if(inputHandler instanceof NodeList && inputHandler.length > 0){
            let mismatchCount = 0;
            for (let field in inputHandler) {
                if (inputHandler.hasOwnProperty(field)) {
                    let element = inputHandler[field];
                    if(element.tagName == 'INPUT') assignToEvents(element);
                    else mismatchCount += 1;
                }
            }
            if(mismatchCount == inputHandler.length){
                throw console.warn("No inputs found!")
            }
        }
        else if(inputHandler.tagName == 'INPUT') assignToEvents(inputHandler);
        else {
            throw console.warn("No inputs found!")
        }

    }

}
// Input masking using array with string format saved, and compare chars per index.
class CustomPlaceHolder {

    constructor({Default = '',Custom = '',Target = undefined, StartWithDefault = true}){
        this.DefaultHolder = Default;
        this.NewHolder = Custom;
        this.Node = Target;
        if(StartWithDefault == true) this.Node.placeholder = this.DefaultHolder;
    }

    OnFocus({ReturnToDefault = true, CustomColor = ''}){
        let defaultColor;
        this.Node.onfocus = () => {this.Node.placeholder = this.NewHolder;}
        if (ReturnToDefault == true) {
            this.Node.onblur = () => {this.Node.placeholder = this.DefaultHolder}
        }

    }
}

class VideoController{
    constructor(playersList){
        this.players = playersList;
        this.loadIsComplete = false;
    }

    HasLoaded(code){
        let onInstanceCreated = async () => {
            if(!this.loadIsComplete){
                for (let player of this.players) {
                    if(player.elements.controls === undefined){
                        /* console.log(this.players[0].elements.controls); */ /* This part of the code should be revised */
                       return await setTimeout(() => onInstanceCreated(), 0.1);
                    }
                }
                /* console.log('but setting to true'); */
                this.loadIsComplete = true;
            }
            code();
        }
        onInstanceCreated();
    }


    ExecuteOnAllPlayers(method){
        for(let player of this.players){
            method(player);
        }
    }

    PauseAll() {
        for (let player of this.players) {
            if(player.playing){
                player.pause();
                return;
            }
        }
    }

    StopAll() {
        for (let player of this.players) {
            if(player.paused || player.playing){
                player.stop();
            }
        }
    }

    HideAllControls() {
        this.HasLoaded(() => {
            for (let player of this.players) {
                player.elements.controls.hidden = true;
            }
        });
    }

    ShowAllControls() {
        for (let player of this.players) {
            player.elements.controls.hidden = false;
        }
    }

    DisablePlayOnClick(toggle, param = {all:true, player:null}){
        if(param.all && !(param.player != null)){
            for (let pl of this.players) {
                pl.config.clickToPlay = !toggle;
            }
        }
        else if (param.player != null){
            param.player.config.clickToPlay = !toggle;
        }
    }

}

class ScrollObserver{

    constructor({observerOptions:observerOptions, customCallback:customCallback} = {observerOptions:undefined, customCallback:undefined}) {

        this.Options = this._defaultOptions;
        this.Callback = (v) => { this._defaultCallback(v) };
        this.State = { ascending: false, descending: false };
        this.OnScrollMove = (val) => { 
            return new CustomEvent('OnScrollMove', {
                detail: { 
                    Up: val === 'Up'? true : false, 
                    Down: val === 'Down'? true : false
                }
            })
        }; 
        this.Initialized = false;
        this.TopPosition = {current:0, previous:0, direction:''};  
        this._numberOfSignedEvents = 0;
        this.Observer = new IntersectionObserver(this.Callback, {
            threshold: this.Options(10)
        });
    
        const _container = document.createDocumentFragment().appendChild(document.createElement('div'));
        _container.setAttribute('id', 'scrollMarkerContainer');

        Object.assign(_container.style, {
            position: 'absolute',
            top: 0,
        })

        let gapBetweenMarkers = 1;
        const areaAvailable = (document.documentElement.scrollHeight - document.documentElement.clientHeight) - window.innerHeight;
        const numberOfMarkers = Math.round(areaAvailable / (window.innerHeight - gapBetweenMarkers));
        let markersHeight = ((areaAvailable) / numberOfMarkers);
        let rest = (numberOfMarkers * (markersHeight + gapBetweenMarkers)) - areaAvailable;
        const _markers = [];
        let position = window.innerHeight;

        for (let index = 0; index < numberOfMarkers; index++) {
            _markers.push(_container.appendChild(document.createElement('div')));
            _markers[index].setAttribute('id', `scrollMarker${index}`);

            if(index != 0) position = position + markersHeight + gapBetweenMarkers;
            if(index == numberOfMarkers - 1) markersHeight += rest * -1;
            
            Object.assign(_markers[index].style, {
                'position': 'absolute',
                'height': `${markersHeight}px`,
                'width': '1px',
                'top': `${position}px`,
                'z-index': '999'
            });

            this.Observer.observe(_markers[index]);
        }

        this.scrollMarker = {
            container: _container,
            markers: _markers
        }

        document.body.appendChild(this.scrollMarker.container);
        ScrollObserver.ActiveObservers.push(this);
    }

    static ActiveObservers = [];

    _defaultOptions = (steps) => {return Array(steps + 1).fill(0).map((_,index) => {
        return index/steps;
    })};

    /**
     * 
     * @param {IntersectionObserverEntry[]} entries 
     */
    _defaultCallback(entries){

        if(this.Initialized) {

            if(this._numberOfSignedEvents < 1) return console.error('No signed event listeners');

            this.TopPosition.current = window.scrollY;

            if(this.TopPosition.current > this.TopPosition.previous || 
                    this.TopPosition.current === this.TopPosition.previous && 
                        this.TopPosition.direction === 'Down') {
                
                this.State = {'descending':true,'ascending':false};
                this.scrollMarker.container.dispatchEvent(this.OnScrollMove('Down'));
                this.TopPosition.direction = 'Down';
            }
            else if(this.TopPosition.current < this.TopPosition.previous || 
                        this.TopPosition.current === this.TopPosition.previous && 
                            this.TopPosition.direction === 'Up') {

                this.State = {'descending':false,'ascending':true};
                this.scrollMarker.container.dispatchEvent(this.OnScrollMove('Up'));
                this.TopPosition.direction = 'Up';
            }

            
            this.TopPosition.previous = this.TopPosition.current;
                        
        }
        else {
            this.Initialized = true;
        }
    }

    On(event = '', callBack = undefined){
        if(callBack !== undefined){
            if(event === 'OnScrollMove'){
                this.scrollMarker.container.addEventListener('OnScrollMove', callBack);
                this._numberOfSignedEvents += 1;
            }
            else if(event === 'OnIntersectionEnter'){
                this.scrollMarker.container.addEventListener('OnIntersectionEnter', callBack);
                this._numberOfSignedEvents += 1;
            }
            else if(event === 'OnIntersectionLeave'){
                this.scrollMarker.container.addEventListener('OnIntersectionLeave', callBack);
                this._numberOfSignedEvents += 1;
            }
            else{
                return console.error("Event not supported");
            }
        }
        else console.error('Callback is undefined.');
    }

    Off(event = '', callBack = undefined){
        if(callBack !== undefined && this._numberOfSignedEvents > 0){
            if(event === 'OnScrollMove'){
                this.scrollMarker.container.removeEventListener('OnScrollMove', callBack);
                this._numberOfSignedEvents -= 1;
            }
            else if(event === 'OnIntersectionEnter'){
                this.scrollMarker.container.removeEventListener('OnIntersectionEnter', callBack);
                this._numberOfSignedEvents -= 1;
            }
            else if(event === 'OnIntersectionLeave'){
                this.scrollMarker.container.removeEventListener('OnIntersectionLeave', callBack);
                this._numberOfSignedEvents -= 1;
            }
            else{
                return console.error("Only event supported is OnScrollMove");
            }
        }
        else console.error('Callback is undefined.');
    }

}

class Sort{

    static quickSort(originalArray) {  
        if (originalArray.length <= 1) {    
            return originalArray;  
        } 
        else {    
            let leftSide = [];   
            let rightSide = [];   
            let newArray = [];   
            let pivot = originalArray.pop();   
            let length = originalArray.length;

            for (let i = 0; i < length; i++) {    
                if (originalArray[i] <= pivot) {  
                    leftSide.push(originalArray[i]);    
                    } 
                else 
                    {     
                        rightSide.push(originalArray[i]);    
                    }   
            }//END FOR   

            return newArray.concat(Sort.quickSort(leftSide), pivot, Sort.quickSort(rightSide));  
        } //END ELSE
    }//END QUICKSORT
}

class WatchScrollPosition{

    constructor(){
        this.Positions = [];
        this.Nodes = {}
        this.ScrollObserver = undefined;
        this.Subscribers = {};
        this._lastPosition = undefined;
        this._positionOffset = 180;
    }

    GetElements({Tags:Tags = [], ExcludedIDs:ExcludedIDs = []}){
        let elements = new Object;
        let nodes, exclude,index = 0;
        if(!Array.isArray(Tags)) Tags = [Tags];
        for (const tag of Tags) {
            nodes = document.querySelectorAll(tag);
            if (ExcludedIDs.length > 0){
                ExcludedIDs = ExcludedIDs.filter((val) => {
                    nodes = Array.from(nodes).filter((node) => {
                        return node.id == val? !(exclude = true) : !(exclude = false);
                    });
                    return !exclude;
                });
                elements[tag] = nodes; 
            }
            else{
                elements[tag] = Array.from(nodes);
            }
            elements[tag].map((node) => {
                this.Nodes[node.getBoundingClientRect().top + window.pageYOffset - this._positionOffset] = node.id? node.id : `node ${index}`; 
            });
            this.Positions = Object.keys(this.Nodes).map((val) => { return parseFloat(val)});
            index++;
        }

        /* console.log(this.Nodes);
        console.log(this.Positions); */
    }

    Watch({ State:State = true , Callback:Callback = undefined, scrollObserver:scrollObserver = undefined}){
        if(State)
        {
            if(Callback !== undefined) this.Subscribers[Callback.name] = Callback;
            else return new Error('Callback is not defined');

            if (scrollObserver === undefined) {
                if(this.ScrollObserver === undefined) {
                    if(ScrollObserver.ActiveObservers.length > 0){
                        this.ScrollObserver = ScrollObserver.ActiveObservers[0];
                    }
                    else {
                        this.ScrollObserver = new ScrollObserver();
                    }
                }
            } 

            else if(this.ScrollObserver === undefined){
                this.ScrollObserver = scrollObserver;
            }


            this.ScrollObserver.On('OnScrollMove', () => {
                for (let i = 0; i < this.Positions.length; i++) {
                    const position = this.Positions[i];
                    if(window.pageYOffset >= position && 
                        !(window.pageYOffset >= this.Positions[i+1]) && 
                            position != this._lastPosition){
                                this._lastPosition = position;
                                if(Callback !== undefined){
                                    for (const subscriber in this.Subscribers) {
                                        this.Subscribers[subscriber](position, this.Nodes);
                                    }
                                    break;
                                }
                                else return new Error('Callback is null.');
                    }
                }
                /* console.log(this.Subscribers); */
            })
        }
        else{
            for (const method in this.Subscribers) {
                if(method == Callback.name){
                    delete this.Subscribers[method];
                    return;
                }
            }
        }
    }

    CurrentSection(){
        let windowPosition = window.pageYOffset;
        for (let i = 0; i < this.Positions.length; i++) {
            const sectionPosition = this.Positions[i];
            if(windowPosition >= sectionPosition && 
                !(windowPosition >= this.Positions[i+1])){
                    return this.Nodes[this.Positions[i]];
            }
            else if(windowPosition < this.Positions[0]){
                return this.Nodes[this.Positions[0]];
            }
        }
    }

}

class ActiveMenuLink{

    constructor(){
        this.ActiveButton = undefined;
        this.NewButton = undefined;
    }

    static ScrollIntoView = false;

    ScrollingIntoView(state){
        ActiveMenuLink.ScrollIntoView = state;
    }

    async Change({
        SectionID = undefined
    }){

        if(!ActiveMenuLink.ScrollIntoView){
            if(this.ActiveButton == undefined) this.ActiveButton =  document.querySelector('.current');
            this.NewButton = document.querySelector(SectionID[0] == '#'? `${SectionID}--button` : `#${SectionID}--button`);

            if(this.NewButton != undefined){
                if(this.ActiveButton.id != this.NewButton.id){
                    this.ActiveButton.classList.remove("current");
                    this.ActiveButton = this.NewButton.parentElement;
                    this.ActiveButton.classList.add("current");
                }
            }
            else return new console.error("Can't find node with specified ID");

        }
    }
}

function debounce(func, wait, immediate) { // Helper method used to contain bursts of events or methods invocations.
    var timeout;
    return function() {
		var context = this, args = arguments;
		if (immediate && !timeout) func.apply(context, args);
		clearTimeout(timeout);
		timeout = setTimeout(function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		}, wait);
	};
}

let innerVisualHeight = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`)
}

/* window.addEventListener('resize', debounce(innerVisualHeight, 150)); */
document.addEventListener('DOMContentLoaded', innerVisualHeight);

let ActiveMenu = new ActiveMenuLink();
/* let HideNavbar = new ScrollObserver();
let Navbar = document.querySelector('#header-wrap');
HideNavbar.On('OnScrollMove', (val) => {
    if(val.detail.Up){
        Navbar.style = "opacity: 1;"
    }
    else{
        Navbar.style = "opacity: 0;"
    }
}); */ /* Instead of only hiding the navbar when the sticky-header class is enabled, it hides in any scroll down. 
In this new version, the opacity is set to 0.*/

let ActiveSection = new WatchScrollPosition();
ActiveSection.GetElements({Tags:'section',ExcludedIDs:['content','slider']});
ActiveSection.Watch({State:true, Callback: (pos,arr) => {
    ActiveMenu.Change({SectionID: arr[pos]});
}});


ActiveMenu.Change({SectionID: ActiveSection.CurrentSection()});

const supportsSmoothScrolling = (() => {
    const body = document.body;
    const defaultScrollBehavior = body.style.scrollBehavior;
    body.style.scrollBehavior = 'smooth';
    const hasSmooth = getComputedStyle(body).scrollBehavior === 'smooth';
    body.style.scrollBehavior = defaultScrollBehavior;
    return hasSmooth;
})();

const supportsScrollMargin = (() => {
    const body = document.body;
    const defaultScrollMarginTop = body.style.scrollMarginTop;
    body.style.scrollMarginTop = '1px';
    const hasSupport = getComputedStyle(body).scrollMarginTop;
    body.style.scrollMarginTop = defaultScrollMarginTop;
    return hasSupport;
})();


if(!supportsScrollMargin){

    let hasClass = document.body.classList.contains('no-scroll-margin');
    if(!hasClass) document.body.classList.add('no-scroll-margin');

    let scrollMarginFragment = new DocumentFragment();
    let scrollMarginMarker = document.createElement('span');
    Object.assign(scrollMarginMarker.style, {
        'position': 'absolute',
        'height': `1px`,
        'width': '1px',
        'top': `0`,
        'z-index': '999'
    });
    scrollMarginMarker.id = "scrollMarginMarker";
    scrollMarginFragment.appendChild(scrollMarginMarker);
    document.body.appendChild(scrollMarginFragment);
}

/* let header = document.querySelector('#header');
ActiveSection.ScrollObserver.On('OnScrollMove', debounce(() => {
    if(!header.classList.contains('sticky-header')) header.classList.add('sticky-header');
}, 75, true)) */
let mobileMenu = document.querySelector('#primary-menu-trigger');

let ScrollIntoView = async (element = undefined) => {
    if(element != undefined){
        ActiveMenu.Change({SectionID:element});
        ActiveMenu.ScrollingIntoView(true);
        ActiveSection.Watch({State:true, Callback: function Unsubscribe(pos, arr){
            if(`#${arr[pos]}` == element){
                ActiveSection.Watch({State:false, Callback: Unsubscribe})
                ActiveMenu.ScrollingIntoView(false);
            }
        }});
        
        let node = document.querySelector(element == '#home'? document.documentElement.clientWidth <= 834 ? '#slider' : '#header' : element);
        try {
            if(supportsSmoothScrolling){
                node.scrollIntoView({
                    behavior: 'smooth',
                    alignToTop: 'false'
                });
            }
            else throw new Error('Smooth behavior is not supported.')
        } catch (error) {
            if(supportsScrollMargin) window.scrollIntoView(node, {behavior: "smooth", duration: 300, block: "start"});
            else {
                let scrollMarginMarker = document.body.querySelector('#scrollMarginMarker');
                let before = getComputedStyle(node,':before');
                let position = node.getBoundingClientRect().top + window.pageYOffset - document.documentElement.clientTop;
                position += parseInt(before.top, 10);
                scrollMarginMarker.style.top = `${position}px`;
                if(node.id == 'slider') window.scrollIntoView(node, {behavior: "smooth", duration: 300, block: "start"});
                else window.scrollIntoView(scrollMarginMarker, {behavior: "smooth", duration: 300, block: "start"});
            }
        }

        let click = new MouseEvent('click');
        mobileMenu.dispatchEvent(click);
    }  
}

let menuButtons = document.querySelectorAll('.menu-container li>a');
let registerButtons = (buttons) => {
    for (const button of buttons) {
        let sectionId = `#${button.id.split("--")[0]}`;
        button.addEventListener('click', (ev) => { 
            ScrollIntoView(sectionId);
        });
    }
}
registerButtons(menuButtons);

let callToActionButton = document.querySelector('#home .home-button');
let node = document.querySelector('.perfil-detalhes--link-wrapper');


callToActionButton.addEventListener('click',() => {
    try {
        if(supportsSmoothScrolling){
            node.scrollIntoView({
                behavior: "smooth", 
                block: "start"
            });
        } else throw new Error('Smooth behavior not supported');
    } catch (error) {
        if(supportsScrollMargin) window.scrollIntoView(node, {behavior: "smooth", duration: 300, block: "start"});
        else {
            let scrollMarginMarker = document.body.querySelector('#scrollMarginMarker');
            let before = getComputedStyle(node,':before');
            let position = node.getBoundingClientRect().top + window.pageYOffset - document.documentElement.clientTop;
            position += parseInt(before.top, 10);
            scrollMarginMarker.style.top = `${position}px`;
            window.scrollIntoView(scrollMarginMarker, {behavior: "smooth", duration: 300, block: "start"});
        }
    }
});


/* fitty('#video-section-play-title', {multiline:true}); */
/* fitty('#video-section-description-parent'); */

// Add the attribute search-active to the search bar panel and control when it's true or not.
/* ScrollReveal().reveal(document.querySelectorAll('.mainpage-experience-block-elements img')); */

let OverlayCarousel = (() => {
    let carousel = new Flickity( document.querySelector(".video-carousel"), {
        wrapAround: true,
        contain: true,
        cellAlign: 'left'
    });
    let selectedSlide = carousel.selectedElement;
    return {
        instance: carousel,
        currentSlide: selectedSlide,
        startTransition: function(code) {
            let previousCanvas = this.currentSlide.firstElementChild;
            let newCanvas = this.instance.selectedElement.firstElementChild;
            if(!newCanvas.classList.contains("video-carousel--fade-complete")){
                newCanvas.classList.add("video-carousel--fade-complete");
                if(code !== undefined){
                    let pauseWhenTransitioned = () => {
                        code();
                        this.instance.selectedElement.removeEventListener("transitionend",pauseWhenTransitioned);
                    }
                    this.instance.selectedElement.addEventListener('transitionend', pauseWhenTransitioned);
                }
            }
            if(newCanvas != previousCanvas){
                previousCanvas.classList.remove("video-carousel--fade-complete");
                this.currentSlide = this.instance.selectedElement;
            }
        },
        resetTransitions: function() {
            for (let cell of this.instance.cells) {
                let canvas = cell.element.firstElementChild;
                if(canvas.classList.contains("video-carousel--fade-complete")){
                    canvas.classList.remove("video-carousel--fade-complete");
                }
            }
        }
    }
})();

let playerController;

function LoadIframes(){
    let iframeSpots = document.querySelectorAll(".video-player");
    let iframeModel = document.createElement("iframe");
    iframeModel.allowFullscreen = true;
    iframeModel.setAttribute("allowtransparency", true);
    iframeModel.allow = "autoplay";
    let baseURL = "https://www.youtube.com/embed/";
    playerController = new VideoController(new Array());

    for (let node of iframeSpots) {
        let clone = iframeModel.cloneNode();
        clone.src = baseURL + node.getAttribute('js-data');
        node.appendChild(clone);
        let player = new Plyr(node);
     /*    let pauseOverlay = document.createElement("div");
        pauseOverlay.className = "obscure-on-pause";
        player.elements.container.appendChild(pauseOverlay); */
        playerController.players.push(player);
    }
    /* document.body.removeEventListener('load', LoadIframes()); */
}

/* document.body.addEventListener('load', LoadIframes()); */


let EnableOverlay = new function() {

    let videoSection = document.querySelector("#video-section-play-title"); /* Make this whole function as a class and remove this query, by searching the children directly. */
    let playButton = videoSection.querySelector('.play-video');
    let overlay = videoSection.querySelector('.video-overlay');
    let carouselButtons = document.querySelectorAll(".flickity-button");
    let videoDescriptions = document.querySelector(".video-overlay--descriptions").children;
    let videoCarousel = document.querySelector(".video-carousel");

    playButton.addEventListener('click',() =>{

        if(playerController === undefined){
            LoadIframes();
        }

        function enableOverlay(isActive) {
            document.querySelector("body").style = isActive ? "overflow:hidden;" : "overflow:visible";
            return isActive;
        }

        function changeActiveDescription(index){
            for (const el of videoDescriptions) {
                el.classList.remove("--active-video");
            }
            videoDescriptions[index].classList.add("--active-video");
        }

        OverlayCarousel.resetTransitions();
        OverlayCarousel.instance.on('change', () => {
                playerController.HideAllControls();
                OverlayCarousel.startTransition(() => {
                    playerController.PauseAll();
                    playerController.StopAll();
                });
                changeActiveDescription(OverlayCarousel.instance.selectedIndex);
        });

        changeActiveDescription(OverlayCarousel.instance.selectedIndex);

        OverlayCarousel.startTransition();

        let stopOnEnd = (ev) => {
            ev.detail.plyr.stop();
        };

        let executeOnPlay = () =>{
            playerController.ShowAllControls();
            for (const button of carouselButtons) {
                let hideButton = () => button.classList.add("flickity-button--hidden");
                let showButton = () => {
                    button.classList.remove("flickity-button--hidden");
                    playerController.ExecuteOnAllPlayers((player) => player.elements.container.removeEventListener('pause', showButton));
                }
                playerController.ExecuteOnAllPlayers((player) => player.elements.container.addEventListener('pause', showButton));
                hideButton();
            }
        }

        playerController.ExecuteOnAllPlayers((player) => {
            player.elements.container.addEventListener('ended', stopOnEnd);
            player.elements.container.addEventListener('playing', executeOnPlay);
        })

        playerController.StopAll();
        playerController.HideAllControls();

        let changeOverlayStatus =  () => {
            overlay.setAttribute('active', (overlay.getAttribute('active') == 'false') ? enableOverlay(true) : enableOverlay(false));
        };
        changeOverlayStatus();

        let DisablePlayOnDrag = (ev) => {
            let CancelClick = (ev) => {
                ev.stopPropagation();
                window.removeEventListener('click', CancelClick, true);
            };
            window.addEventListener('click', CancelClick, true);
        };

        OverlayCarousel.instance.on('dragStart', DisablePlayOnDrag);

        overlay.addEventListener('click',function CloseOverlay(ev){
            if(ev.target != this && !ev.target.classList.contains('icon-line-cross') && !ev.target.classList.contains('video-overlay-close')){
                return;
            }
            changeOverlayStatus();
            overlay.removeEventListener('click',CloseOverlay);
            OverlayCarousel.instance.select(0,false,true);
            /* overlay.firstElementChild.removeEventListener('click',PreventParentClick);  */
            playerController.PauseAll();
            playerController.ExecuteOnAllPlayers((player) => {
                player.elements.container.removeEventListener('ended', stopOnEnd);
                player.elements.container.removeEventListener('playing', executeOnPlay);
            });
            OverlayCarousel.instance.off('dragStart', DisablePlayOnDrag);
        });

        OverlayCarousel.instance.resize();
    });
};


/* let searchButton = document.getElementById("top-search-trigger");
let searchPanel = searchButton.closest(".header-row");
searchPanel.setAttribute('search-active',false);

searchButton.addEventListener('click', () => {
    let typedOnSearchBar;
    let searchBlur;
    let searchInput = document.getElementById("main-search-bar");
    searchInput.setAttribute('empty', true);
    if(searchPanel.hasAttribute("search-active") && searchPanel.getAttribute('search-active') == "false"){
        if(searchInput.value != '') searchInput.value = '';
        searchPanel.setAttribute('search-active',true);
        typedOnSearchBar = (ev) => {
            if(ev.inputType != "deleteContentBackward" && !searchInput.value == ''){
                searchInput.setAttribute('empty', false);
            }
            else if(ev.inputType == "deleteContentBackward" && searchInput.value == ''){
                searchInput.setAttribute('empty', true);
            }
        }
        searchBlur = (ev) => {
            if(ev.target.id != "main-search-bar" && ev.target.id != "close-search-bar" ){
                if (searchPanel.getAttribute('search-active') == "true") {
                    searchPanel.setAttribute('search-active',false);
                    document.removeEventListener('click', searchBlur);
                    searchInput.removeEventListener('input', typedOnSearchBar);
                }
            }

        }
        searchInput.addEventListener('input', typedOnSearchBar);
        document.addEventListener('click', searchBlur);
        searchInput.focus();
    }
    else if (searchPanel.getAttribute('search-active') == "true") {
        searchPanel.setAttribute('search-active',false);
        searchInput.removeEventListener('input', typedOnSearchBar);
        document.removeEventListener('click', searchBlur);
    }
}) */ /* Disabled search features */

// Update the contact form to the correct city, based on the button pressed.

const tabPanel = document.querySelector('.tab-pane');
const form = tabPanel.querySelector('form');
const tabsContainer = document.querySelector('#cityTabs');
const tabs = tabsContainer.querySelectorAll('a');
let tabState = {current: ''};

tabsContainer.addEventListener('OnTabFocusChange', (ev) => {
    let newTab = ev.target.id;
    if(tabState.current != newTab){
       let keys = Object.keys(tabState);
       for (let i = 1; i < keys.length; i++) {
           const tab = keys[i];
           if(tab != newTab && tabState[tab].node.classList.contains('active')){
            tabState[tab].node.classList.remove('active');
            tabState[tab].isActive = false;
            }    
       }
       tabState[newTab].node.classList.add('active');
       tabState[newTab].isActive = true;
       tabState['current'] = newTab;
    }
});


for (const tab of tabs) {
    tabState[tab.id] = tab.classList.contains('active') ? (() => {
        tabState['current'] = tab.id; 
        return {isActive: true, node: tab}
    })() : {isActive: false, node: tab};
    tab.addEventListener('click', (ev) =>{
        let cityName = ev.target.getAttribute('aria-controls');
        let isActive = ev.target.classList.contains('active');

        if (!isActive){  
            /* form.setAttribute('fieldset','disabled') */
            ev.target.dispatchEvent(new CustomEvent('OnTabFocusChange', {bubbles: true}));
            tabPanel.id = cityName;
            tabPanel.setAttribute('aria-labelledby',ev.target.id);
            tabPanel.classList.remove('show');
            tabsContainer.setAttribute('activeTab',ev.target.id);

            for (const field of form.elements) {
                    field.disabled = true;
                    if(field.hasAttribute('required')) field.removeAttribute('required');
            }

            setTimeout(() => {
                let cityField = form.elements.namedItem('contato-form-city'); //Requesting the city field inside the form.
                for (const field of form.elements) { //Reseting fields to default values.
                    field.setCustomValidity('');
                    field.removeAttribute('isvalid');
                    field.disabled = false;
                    field.value = '';
                }
                cityField.value = cityName.charAt(0).toUpperCase() + cityName.slice(1); //Changing the first letter of the word to uppercase and mergin with the rest of the word.
                tabPanel.classList.add('show');
            }, 300);

        }
    });
}


let menuIsOpen = false;
let executeOnMenuOpened = new MutationObserver( (mutationList, observer)=> {
    for (let mutation of mutationList) {
        if (mutation.type == 'attributes' && mutation.attributeName == 'class'){
            if(mutation.target.classList.contains('primary-menu-open')){
                if(menuIsOpen == false){
                    bodyScrollLock.disableBodyScroll(mutation.target);
                    menuIsOpen = true;
                }
            }
            else if(menuIsOpen == true) {
                bodyScrollLock.enableBodyScroll(mutation.target);
                document.getElementsByClassName('header-wrap-clone')[0].removeAttribute('style');
                menuIsOpen = false;
            }
        }
    }
});

executeOnMenuOpened.observe(document.querySelector("body"), {attributes:true});

let fieldValidation = new FieldValidation();
fieldValidation.ListenToField({
        nodeList:document.querySelectorAll("input[id^='contato-form']")
    }
);

let emailPlaceHolder = new CustomPlaceHolder({
    Default:'Seu email',
    Custom:'email@dominio.com',
    Target: document.getElementById('contato-form-email'),
    StartWithDefault: true
    }).OnFocus({ReturnToDefault:true});

let calendarPlaceHolder = new CustomPlaceHolder({
    Default: "Data de Interesse",
    Custom: "DD/MM/AAAA",
    Target: document.getElementById('contato-form-date'),
    StartWithDefault: true
}).OnFocus({ReturnToDefault:true});

let phonePlaceHolder = new CustomPlaceHolder({
    Default: "Seu Telefone",
    Custom: '(DD) X XXXX-XXXX',
    Target: document.getElementById('contato-form-phone'),
    StartWithDefault: true
}).OnFocus({ReturnToDefault:true});


jQuery('.home-date').datepicker({
    language: 'pt-BR',
    autoclose: true,
    startDate: "tomorrow",
    endDate: "+2m",
});


/* testing.On('OnScrollDown',()=>{}); */


let perfilButtons = {};
perfilButtons.curriculo = document.getElementById("curriculo-session");
perfilButtons.simposios = document.getElementById("simposio-session");
perfilButtons.publicacoes = document.getElementById("publicacoes-session");

let enableSession = (el) => {
    
    let activeButton = el.currentTarget;
    let block = document.getElementsByClassName('perfil-container')[0];
    let isMobile = document.documentElement.clientWidth <= 834;

    if(!document.body.classList.contains('--obscured')){
        if(isMobile){
            document.body.classList.add('--obscured');
        }
    }
    
    if(isMobile) innerVisualHeight();

    if(!el.currentTarget.classList.contains('--active')){
        block.classList.add('--active');
        for (let button in perfilButtons) {
            button = perfilButtons[button];
            if(button.id != activeButton.id){
                if(!button.classList.contains('--inactive')){
                    button.classList.add('--inactive');
                    if(isMobile) bodyScrollLock.enableBodyScroll(button);
                }
            }
            else{
                if(button.classList.contains('--inactive')){
                    button.classList.remove('--inactive');
                }
                if(!button.classList.contains('--active')){
                    button.classList.add('--active');
                    if(isMobile) bodyScrollLock.disableBodyScroll(button);
                }
            }
        }
    }
    else{
        block.classList.remove('--active');
        el.currentTarget.classList.remove('--active');
        for (let button in perfilButtons) {
            button = perfilButtons[button];
            button.classList.remove('--inactive');
        }
        if(document.body.classList.contains('--obscured')){
            document.body.classList.remove('--obscured');
        }
        if(isMobile) bodyScrollLock.clearAllBodyScrollLocks();
    }
    /* window.addEventListener("scroll", debounce(innerVisualHeight, 150)); */
};

for (let button in perfilButtons) {
    button = perfilButtons[button];
    button.addEventListener('click', enableSession, true);
}
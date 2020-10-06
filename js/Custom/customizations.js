class FieldValidation{

    constructor(){
        this.fieldsList = {};
        this.lastInFocus = '';
        this.displayingTooltip = false;
        this.dismissed = ''; // Indicates when pop up is dismissed.
    }

    ListenToFieldID({} = {}){

    }

    'use strict';
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

    'use strict';
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

    'use strict';
    StopThis(obj){
        if(obj in this.fieldsList && this.fieldsList[obj].controller != null){
            clearTimeout(this.fieldsList[obj].controller);
            this.fieldsList[obj].controller = null;
            this.fieldsList[obj].status = 'off';
        }
    }


    'use strict';
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

    'use strict';
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
                        console.log(this.players[0].elements.controls);
                       return await setTimeout(() => onInstanceCreated(), 0.1);
                    }
                }
                console.log('but setting to true');
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
            console.log('executing code');
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
                console.log(pl);
            }
        }
        else if (param.player != null){
            param.player.config.clickToPlay = !toggle;
        }
    }

}


class ScrollObserver{

    constructor({observerOptions:observerOptions, customCallback:customCallback} = {observerOptions:undefined, customCallback:undefined}) {

        this.Options = (observerOptions != undefined)? observerOptions : this._defaultOptions;
        this.Callback = (customCallback != undefined)? customCallback : (v) => {this._defaultCallback(v)};
        this.Position = {previous:undefined, current:undefined};
        this.IntersectionRatio = {previous:undefined, current:undefined};
        this.isIntersecting = false;
        this.State = {ascending: false, descending: false};
        this.OnScrollDown = new CustomEvent ('OnScrollDown', {
            detail:{
                entering:true
            }
        });
        this.OnScrollUp = new CustomEvent ('OnScrollUp', {
            detail:{
                leaving:true
            }
        });
        this.defaultSteps = 100;
        this.markerMovement = {
            get bottomMarker() {
                return window.scrollY + window.innerHeight;
            },
            get topMarker() {
                return window.scrollY - 10;
            },
            maxPosition: window.scrollMaxY
        }
        this.Observer = new IntersectionObserver(this.Callback, {
            threshold: this.Options(this.defaultSteps)
        });

        const _container = document.createDocumentFragment().appendChild(document.createElement('div'));
        _container.setAttribute('id', 'scrollMarkerContainer');

        const _topMarker = _container.appendChild(document.createElement('div'));
        _topMarker.setAttribute('id', 'scrollTopMarker');

        const _bottomMarker = _container.appendChild(document.createElement('div'));
        _bottomMarker.setAttribute('id', 'scrollBottomMarker');

        this.scrollMarker = {
            container: _container,
            topMarker: _topMarker,
            bottomMarker: _bottomMarker
        }

        Object.assign(this.scrollMarker.container.style, {
            'position': 'absolute',
            'display': 'flex',
            'height': document.body.scrollHeight.toString() + 'px',
            'top': 0,
            'background': 'yellow'
        });
        Object.assign(this.scrollMarker.topMarker.style, {
            'position': 'absolute',
            'height': '10px',
            'width': '10px',
            'top': `${this.markerMovement.topMarker}px`,
            'z-index': '999',
            'background': 'red'
        });
        Object.assign(this.scrollMarker.bottomMarker.style, {
            'position': 'absolute',
            'height': '10px',
            'width': '10px',
            'top': `${this.markerMovement.bottomMarker}px`,
            'z-index': '999',
            'background': 'red'
        });

        document.body.appendChild(this.scrollMarker.container);
        this.Observer.observe(this.scrollMarker.bottomMarker);
        this.Observer.observe(this.scrollMarker.topMarker);
    }

    _defaultOptions = (steps) => {return Array(steps + 1).fill(0).map((_,index) => index/steps || 0)};

    On(event = '', callBack = undefined){
        if(callBack !== undefined){
            if(event === 'OnScrollDown'){
                this.scrollMarker.container.addEventListener('OnScrollDown', callBack);
            }
            else if(event === 'OnScrollUp'){
                this.scrollMarker.container.addEventListener('OnScrollUp', callBack);
            }
            else{
                return console.error("Only events supported are OnScrollUp or OnScrollDown");
            }
        }
        else console.error('Callback is undefined.');
    }

    /**
     * 
     * @param {IntersectionObserverEntry[]} entries 
     */
    _defaultCallback(entries){

        let entry = entries[0];
        this.Position.current = entry.boundingClientRect.y;
        if(this.Position.previous === undefined) this.Position.previous = this.Position.current;
        this.IntersectionRatio.current = entry.intersectionRatio;
        if(this.IntersectionRatio.previous === undefined) this.IntersectionRatio.previous = this.IntersectionRatio.current;
        this.isIntersecting = entry.isIntersecting;

        let moveMarker = (direction) => {
            direction = direction === 'up'? -10 :
                direction === 'down'? 10 : undefined;
            let newPosition;
            for (const marker of ['bottomMarker', 'topMarker']) {
                newPosition = this.markerMovement[marker] + direction;
                this.scrollMarker[marker].style.top = `${newPosition}px`;
            }
        }

        console.log(entry.target.id)

        if(this.Position.current < this.Position.previous && entry.target.id === 'scrollBottomMarker'){
            if(this.IntersectionRatio.current > this.IntersectionRatio.previous && this.isIntersecting){
                if(this.OnScrollDown !== undefined){
                    this.State.descending = true;
                    console.log('down')
                    moveMarker('down');
                    this.scrollMarker.container.dispatchEvent(this.OnScrollDown);
                }
                else console.error('Event is undefined');
            }
            else {
                if(this.OnScrollDown !== undefined){
                    this.State.descending = true;
                    moveMarker('down');
                    console.log('down')
                    this.scrollMarker.container.dispatchEvent(this.OnScrollDown);
                }
                else console.error('Event is undefined');
            }
        }
        else if(this.Position.current > this.Position.previous && this.isIntersecting && entry.target.id === 'scrollTopMarker'){
            if(this.IntersectionRatio.current < this.IntersectionRatio.previous){
                if(this.OnScrollUp !== undefined){
                    this.State.ascending = true;
                    moveMarker('up');
                    console.log('leaving');
                    this.scrollMarker.container.dispatchEvent(this.OnScrollUp);
                }
                else console.error('Event is undefined');
            }
            else{
                if(this.OnScrollUp !== undefined){
                    console.log('entering')
                    this.State.ascending = true;
                    moveMarker('up');
                    this.scrollMarker.container.dispatchEvent(this.OnScrollUp);
                }
                else console.error('Event is undefined');
            }
        }

        this.Position.previous = this.Position.current;
        this.IntersectionRatio.previous = this.IntersectionRatio.current;
    }
}

let testing = new ScrollObserver();
/* testing.On('OnScrollDown',()=>{}); */
testing.On('OnScrollUp',()=>{});

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
    let videoSection = document.querySelector("#video-section-play-title");
    let playButton, overlay;
    let carouselButtons = document.querySelectorAll(".flickity-button");
    let videoDescriptions = document.querySelector(".video-overlay--descriptions").children;
    let videoCarousel = document.querySelector(".video-carousel");

    for (let node of videoSection.children) {
        if(node.classList.contains("play-video")) playButton = node;
        if(node.classList.contains("video-overlay")) overlay = node;
    }

    playButton.addEventListener('click',() =>{

        if(playerController === undefined){
            LoadIframes();
            /* playerController = new VideoController(Plyr.setup('.video-player')); */
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
        let executeOnPlay = (ev) =>{
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

            /* let overlay = ev.target.querySelector(".obscure-on-pause");
            let showPauseOverlay = (ev) => {
                overlay.classList.add("--active");
                ev.target.removeEventListener('pause', showPauseOverlay);
                let disableOnSlideChange = () => {
                    ev.target.removeEventListener('pause', showPauseOverlay);
                    overlay.classList.remove("--active");
                    OverlayCarousel.instance.off('change', disableOnSlideChange);
                };
                OverlayCarousel.instance.on('change', disableOnSlideChange);
            };

            ev.target.addEventListener('pause', showPauseOverlay);

            if(overlay.classList.contains("--active")){
                overlay.classList.remove("--active");
            } */
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


        /* overlay.firstElementChild.addEventListener('click', function PreventParentClick(ev) {
            ev.stopPropagation();
        });  */
    });
};


let searchButton = document.getElementById("top-search-trigger");
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
})

// Update the contact form to the correct city, based on the button pressed.
let anchorList = document.getElementsByClassName('nav-link py-3');
for (const anchor of anchorList) {
    anchor.onclick = () =>{
        let tabPanel = document.getElementsByClassName('tab-pane')[0];
        let cityName = anchor.getAttribute('aria-controls');
        if (tabPanel.id != cityName){
            let form = tabPanel.getElementsByTagName('form')[0];
            let tabs = document.getElementById('cityTabs');
            form.setAttribute('fieldset','disabled')
            tabPanel.id = cityName;
            tabPanel.setAttribute('aria-labelledby',anchor.id);
            tabPanel.classList.remove('show');
            tabs.setAttribute('activeTab',anchor.id);
            for (const field of form.elements) {
                    field.disabled = true;
                    if(field.hasAttribute('required')) field.removeAttribute('required');
            }
            setTimeout(() => {
                let cityField = form.elements.namedItem('contato-form-city')
                tabPanel.classList.add('show');
                for (const field of form.elements) {
                    field.setCustomValidity('');
                    field.removeAttribute('isvalid');
                    field.disabled = false;
                    field.value = '';
                }
                cityField.value = cityName.charAt(0).toUpperCase() + cityName.slice(1);
            }, 300);
        }
    }
}

let activeSectionElement = document.querySelector('.current');

let ScrollIntoView = (menuItem = undefined, element) => {
    let node = document.querySelector(element);
    node.scrollIntoView({
        behavior: 'smooth',
        alignToTop: 'false'
    });
    if(menuItem != undefined){
        activeSectionElement.classList.remove("current");
        menuItem.parentElement.classList.add("current");
        activeSectionElement = menuItem.parentElement;
    }
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



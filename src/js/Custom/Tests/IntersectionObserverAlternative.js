class ScrollObserver{

    /* Detects to each direction the user scrolled in the object and in what percentage is intersecting */

    constructor({observerOptions:observerOptions, customCallback:customCallback} = {observerOptions:undefined, customCallback:undefined}) {

        this.Options = (observerOptions != undefined) ? observerOptions : this._defaultOptions;
        this.Callback = (customCallback != undefined) ? customCallback : (v) => { this._defaultCallback(v) };
        this.Position = { previous: undefined, current: undefined };
        this.IntersectionRatio = { previous: undefined, current: undefined };
        this.Target = {previous: undefined, current: undefined};
        this.isIntersecting = false;
        this.State = { ascending: false, descending: false };
        this.OnScrollMove = (val) => { 
            return new CustomEvent('OnScrollMove', {
                detail: { 
                    Up: val === 'Up'? true : false, 
                    Down: val === 'Down'? true : false
                }
            })
        };   
        this._numberOfSignedEvents = 0;
        this.Observer = new IntersectionObserver(this.Callback, {
            threshold: this.Options(10)
        });
        this.Initialized = false;
        this.ActiveTargets = [];

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
                'width': '10px',
                'top': `${position}px`,
                'z-index': '999',
                'background': 'red'
            });

            this.Observer.observe(_markers[index]);
        }

        this.scrollMarker = {
            container: _container,
            markers: _markers
        }

        document.body.appendChild(this.scrollMarker.container);
        
    }

    _defaultOptions = (steps) => {return Array(steps + 1).fill(0).map((_,index) => {
        return index/steps;
    })};

    On(event = '', callBack = undefined){
        if(callBack !== undefined){
            if(event === 'OnScrollMove'){
                this.scrollMarker.container.addEventListener('OnScrollMove', callBack);
                this._numberOfSignedEvents += 1;
            }
            else{
                return console.error("Only event supported is OnScrollMove");
            }
        }
        else console.error('Callback is undefined.');
    }

    Off(event = '', callBack = undefined){
        if(callBack !== undefined){
            if(event === 'OnScrollMove'){
                this.scrollMarker.container.addEventListener('OnScrollMove', callBack);
                this._numberOfSignedEvents += 1;
            }
            else{
                return console.error("Only event supported is OnScrollMove");
            }
        }
        else console.error('Callback is undefined.');
    }

    /**
     * 
     * @param {IntersectionObserverEntry[]} entries 
     */
    _defaultCallback(entries){
        if(this.Initialized) {

            if(this.Target.current != entries[entries.length - 1].target.id && this.IntersectionRatio.previous > 0 && this.IntersectionRatio.previous < 0.90) return;
            let entry = entries[entries.length - 1];
            this.Position.current = entry.boundingClientRect.y;
            this.IntersectionRatio.current = entry.intersectionRatio;
            this.isIntersecting = entry.isIntersecting;
            this.Target.current = entry.target.id;

            this.TopPosition.current = window.scrollY;


                       
            if(this._numberOfSignedEvents <= 0) return console.error('No signed event listeners');

            if(entry.intersectionRatio > 0 && this.IntersectionRatio.current > this.IntersectionRatio.previous){
                if(this.Position.current < this.Position.previous && 
                    entry.target.id === this.Target.previous){
                        this.State = {'descending':true,'ascending':false};
                        this.scrollMarker.container.dispatchEvent(this.OnScrollMove('Down'));         
                }
                else{ 
                    this.State = {'descending':false,'ascending':true}
                    this.scrollMarker.container.dispatchEvent(this.OnScrollMove('Up'));
                }
            }
            else if(entry.intersectionRatio > 0 && this.IntersectionRatio.current < this.IntersectionRatio.previous){
                if(this.Position.current > this.Position.previous && 
                    entry.target.id === this.Target.previous){
                        this.State = {'descending':false,'ascending':true};
                        this.scrollMarker.container.dispatchEvent(this.OnScrollMove('Up'));
                }
                else{
                    this.State = {'descending':true,'ascending':false};
                    this.scrollMarker.container.dispatchEvent(this.OnScrollMove('Down'));
                }
            }

            this.Position.previous = this.Position.current;
            this.IntersectionRatio.previous = this.IntersectionRatio.current;
            this.Target.previous = this.Target.current;
        }

        else {
            this.TopPosition.previous = 0;
            this.Position.previous = entries[entries.length - 1].boundingClientRect.y;
            this.IntersectionRatio.previous = entries[entries.length - 1].intersectionRatio;
            this.Target.previous = entries[0].target.id;
            this.Initialized = true;
        }
    }
}

/* New code solution for scroll direction */

/* if(this.TopPosition.current > this.TopPosition.previous || 
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


this.TopPosition.previous = this.TopPosition.current; */
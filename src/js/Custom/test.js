

if(entry.isIntersecting && this.Target.current != this.Target.previous){
    if(entry.intersectionRatio > this.IntersectionRatio.previous){
        if(this.DocumentPosition.current > this.DocumentPosition.previous){

        }
    }
    if(entry.intersectionRatio < this.IntersectionRatio.previous){
        if(this.DocumentPosition.current < this.DocumentPosition.previous){

        }
    }
}

if(!entry.isIntersecting && entry.intersectionRatio == 0){
    if(window.screenY < this.DocumentPosition.current){

    }
    if(window.screenY > this.DocumentPosition.current){
        
    }
}
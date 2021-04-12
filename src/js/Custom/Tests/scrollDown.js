let callToActionButton = document.querySelector('#home .home-button');
let node = document.querySelector('.perfil-detalhes--link-wrapper');

if ('addEventListener' in document) {
	document.addEventListener('DOMContentLoaded', function() {
		FastClick.attach(callToActionButton);
	}, false);
}

callToActionButton.addEventListener('click',() => {
    try {
        if(supportsSmoothScrolling){
            node.scrollIntoView({
                behavior: "smooth", 
                block: "start"
            });
        } else throw new Error('Smooth behavior not supported');
    } catch (error) {
        window.scrollIntoView(node, {behavior: "smooth", ease: t => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t, duration: 250, block: "start"});
    }
});
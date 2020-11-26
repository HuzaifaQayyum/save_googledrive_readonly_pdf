function loadCdn() { 
    if (window.jsPDF) return;
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js';
    
    document.body.appendChild(script);
}

function getImageUriFromImageElement(imageElement) { 
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.height = imageElement.height;
    canvas.width = imageElement.width;

    context.drawImage(imageElement, 0, 0, imageElement.width, imageElement.height);
    const result =  canvas.toDataURL('PNG', 1.0);

    return result;
}

function getElements() { 
    return document.querySelectorAll('img[src^="blob:"]');
}

function generatePdf(elements) { 
    const pdf = new jsPDF({
        orientation: 'portrait'
    });

    for (const pdfImage of elements) { 
        const dataUri = getImageUriFromImageElement(pdfImage);
        pdf.addImage(dataUri, 'PNG', 0, 0);
        pdf.addPage();
    }


    var pageCount = pdf.internal.getNumberOfPages();
    pdf.deletePage(pageCount);

    return pdf;
}

function prepareDownload() { 
    loadCdn();
    scrollToEnd();
}

function saveImagesPDF(name='secured.pdf') { 
    const elements = getElements();
    const pdf = generatePdf(elements)
    pdf.save(name);
}


function scrollToEnd(){
    let allElements = document.querySelectorAll("*");
    let chosenElement;
    let heightOfScrollableElement = 0;

    for (i = 0; i < allElements.length; i++) {
        if ( allElements[i].scrollHeight>=allElements[i].clientHeight){
            if (heightOfScrollableElement < allElements[i].scrollHeight){
                heightOfScrollableElement = allElements[i].scrollHeight;
                chosenElement = allElements[i];
            }
        }
    }

    if (chosenElement.scrollHeight > chosenElement.clientHeight){

        let scrollDistance = Math.round(chosenElement.clientHeight/2);

        let loopCounter = 0;
        function myLoop(remainingHeightToScroll, scrollToLocation) {
            loopCounter = loopCounter+1;

            setTimeout(function() {
                if (remainingHeightToScroll === 0){
                    scrollToLocation = scrollDistance;
                    chosenElement.scrollTo(0, scrollToLocation);
                    remainingHeightToScroll = chosenElement.scrollHeight - scrollDistance;
                }else{
                    scrollToLocation = scrollToLocation + scrollDistance ;
                    chosenElement.scrollTo(0, scrollToLocation);
                    remainingHeightToScroll = remainingHeightToScroll - scrollDistance;
                }

                if (remainingHeightToScroll >= chosenElement.clientHeight){
                    myLoop(remainingHeightToScroll, scrollToLocation)
                }
            }, 400)
        }
        myLoop(0, 0);
    }
}
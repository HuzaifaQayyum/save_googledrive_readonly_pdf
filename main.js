function loadScript(url) { 
    return new Promise((res, rej) => {
        const script = document.createElement('script');
        script.src = url;
        document.body.appendChild(script);
        script.async = true;

        script.onload = res;
        script.onerror = rej;
    })
    
}

async function loadCdns(urls=['https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js']) { 
    const urlsToLoad = urls;

    for (const url of urlsToLoad) 
        await loadScript(url)
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
    const pdf = new jsPDF('p', 'mm', 'a4');

    for (const pdfImage of elements) { 
        const dataUri = getImageUriFromImageElement(pdfImage);
        pdf.addImage(dataUri, 'PNG', 0, 0);
        pdf.addPage();
    }


    var pageCount = pdf.internal.getNumberOfPages();
    pdf.deletePage(pageCount);

    return pdf;
}


async function saveImagesPDF(name=document.querySelector('title').text) { 
    await loadCdns() 
    const elements = getElements();
    const pdf = generatePdf(elements)
    pdf.save(name + '.pdf');
}
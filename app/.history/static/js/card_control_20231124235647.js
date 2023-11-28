function deleteImage(id) {
    fetch('/api/img/' + id, {
        method: 'DELETE',
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        location.reload();
    }).catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

function editImage(id) {
    window.location.href = '/edit/' + id;
  }

function copyImage(url) {
    fetch(url).then(response => response.blob()).then(blob => {
        const item = new ClipboardItem({'image/png': blob});
        navigator.clipboard.write([item]);
    });
}

function downloadImage(url) {
    fetch(url).then(response => response.blob()).then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'image.png';
        a.click();
    });
}
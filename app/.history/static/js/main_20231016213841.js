const input = document.querySelector('#add-image');
const imageContainer = document.querySelector('.image-container');
const imageButtons = document.querySelector('.image-buttons');
const imageName = document.querySelector('.image-name');
const imageButton = document.querySelector('.image-button');
let img;

input.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
          const img = new Image();
          img.src = e.target.result;
          img.onload = function() {
              const MAX_SIZE = 600;
              const canvas = document.createElement('canvas');
              if (img.width > img.height) {
                  if (img.width > MAX_SIZE) {
                      img.height *= MAX_SIZE / img.width;
                      img.width = MAX_SIZE;
                  }
              } else {
                  if (img.height > MAX_SIZE) {
                      img.width *= MAX_SIZE / img.height;
                      img.height = MAX_SIZE;
                  }
              }
              canvas.width = img.width;
              canvas.height = img.height;
              imageContainer.innerHTML = '';
              imageContainer.appendChild(canvas);
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              imageButtons.style.display = 'flex';
              imageName.textContent = file.name;
              imageName.style.display = 'block';
              imageButton.style.display = 'block';
              dropZone.style.display = 'none';
              //drawHistogram(img);
          }
      };
      reader.readAsDataURL(file);
  } else {
      imageButtons.style.display = 'none';
      imageName.style.display = 'none';
      imageButton.style.display = 'none';
  }
});

function loadImageFromUrl(url) {
  fetch(url)
  .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.blob();
  })
  .then(blob => {
      const reader = new FileReader();
      reader.onload = (e) => {
          const img = new Image();
          img.src = e.target.result;
          img.onload = function() {
            const MAX_SIZE = 600;
            const canvas = document.createElement('canvas');
            if (img.width > img.height) {
                if (img.width > MAX_SIZE) {
                    img.height *= MAX_SIZE / img.width;
                    img.width = MAX_SIZE;
                }
            } else {
                if (img.height > MAX_SIZE) {
                    img.width *= MAX_SIZE / img.height;
                    img.height = MAX_SIZE;
                }
            }
            canvas.width = img.width;
            canvas.height = img.height;
            imageContainer.innerHTML = '';
            imageContainer.appendChild(canvas);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            imageButtons.style.display = 'flex';
            imageName.textContent = file.name;
            imageName.style.display = 'block';
            imageButton.style.display = 'block';
            dropZone.style.display = 'none';
          };
          img.onerror = function() {
              console.error('Ошибка при загрузке изображения');
          };
      };
      reader.onerror = function() {
          console.error('Ошибка при чтении файла');
      };
      reader.readAsDataURL(blob);
  })
  .catch(e => {
      console.error('Ошибка при загрузке изображения: ', e);
      imageButtons.style.display = 'none';
      imageName.style.display = 'none';
      imageButton.style.display = 'none';
  });
}

function deleteImageByUrl(url) {
  fetch(url, {
    method: 'DELETE',
  }).then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      window.location.href = '/card';
  }).catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
  });
}



cropButton.addEventListener('click', () => {
  const canvasElement = imageContainer.querySelector('canvas');
  if (canvasElement) {
    cropper = new Cropper(canvasElement, {
      aspectRatio: 1
    });

    const confirmCropButton = document.createElement('button');
    confirmCropButton.textContent = 'Подтвердить обрезку';
    rightPanel.appendChild(confirmCropButton);

    confirmCropButton.addEventListener('click', () => {
      const labels = imageContainer.querySelectorAll('[data-id]');
      const cropBoxData = cropper.getCropBoxData();
      const labelPositions = [];
      labels.forEach((label) => {
        const rect = label.getBoundingClientRect();
        const scaleX = canvasElement.width / canvasElement.offsetWidth;
        const scaleY = canvasElement.height / canvasElement.offsetHeight;
        const x = (rect.left - canvasElement.offsetLeft) * scaleX;
        const y = (rect.top - canvasElement.offsetTop) * scaleY;
        if (x >= cropBoxData.left && x <= cropBoxData.left + cropBoxData.width && y >= cropBoxData.top && y <=
                                                                        cropBoxData.top + cropBoxData.height) {
          labelPositions.push({x, y, text: label.textContent, fontSize: label.style.fontSize, fontFamily:
                                getComputedStyle(label).fontFamily, color: label.style.color});
        }
      });

      cropper.getCroppedCanvas({
        maxWidth: 600,
        maxHeight: 600,
        fillColor: '#fff',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      }).toBlob((blob) => {
        const url = URL.createObjectURL(blob);

        const newCanvas = document.createElement('canvas');
        const ctxNewCanvas = newCanvas.getContext('2d');
        const img = new Image();
        img.onload = function() {
          newCanvas.width = img.width;
          newCanvas.height = img.height;
          ctxNewCanvas.drawImage(img, 0, 0, img.width, img.height);

          labelPositions.forEach((label) => {
            ctxNewCanvas.font = `${label.fontSize} ${label.fontFamily}`;
            ctxNewCanvas.fillStyle = label.color;
            ctxNewCanvas.fillText(label.text, label.x, label.y);
          });

          imageContainer.innerHTML = '';
          imageContainer.appendChild(newCanvas);

          rightPanel.removeChild(confirmCropButton);
        };
        img.src = url;
      });
    });
  }
});





//function to add title/label/text on picture

const labelButton = document.querySelector('#labelButton');
let labelId = 0;

labelButton.addEventListener('click', () => {
  const canvas = imageContainer.querySelector('canvas');
  if (!canvas) {
    Swal.fire({
      icon: 'error',
      title: 'Ошибка',
      text: 'Добавьте изображение перед созданием метки'
    });
    return;
  }

  const labelContainer = document.createElement('div');
  labelContainer.style.position = 'absolute';
  labelContainer.style.top = '50%';
  labelContainer.style.left = '50%';
  labelContainer.style.transform = 'translate(-50%, -50%)';
  labelContainer.style.maxWidth = '100%';
  labelContainer.style.maxHeight = '100%';

  const label = document.createElement('div');
  label.dataset.id = labelId++;
  label.contentEditable = true;
  label.style.display = 'inline-block';
  label.style.color = '#FFFFFF';
  label.style.fontSize = '24px';
  label.style.textShadow = '2px 2px black';
  label.textContent = 'Enter text here';

// Create a select element for font styles
const fontStyleSelect = document.createElement('select');
fontStyleSelect.size = 1; // Set the size to 1 to display only one option at a time
fontStyleSelect.addEventListener('change', () => {
  let selectedOptions = Array.from(fontStyleSelect.selectedOptions);
  let styles = selectedOptions.map(option => option.value);
  if (styles.includes('italic')) {
    label.style.fontStyle = 'italic';
  } else {
    label.style.fontStyle = 'normal';
  }
  if (styles.includes('bold')) {
    label.style.fontWeight = 'bold';
  } else {
    label.style.fontWeight = 'normal';
  }
  if (styles.includes('underline')) {
    label.style.textDecoration = 'underline';
  } else {
    label.style.textDecoration = 'none';
  }
});

// Create options for the select element
const italicOption = document.createElement('option');
italicOption.value = 'italic';
italicOption.textContent = 'Italic';

const boldOption = document.createElement('option');
boldOption.value = 'bold';
boldOption.textContent = 'Bold';

const underlineOption = document.createElement('option');
underlineOption.value = 'underline';
underlineOption.textContent = 'Underline';

// Append options to the select element
fontStyleSelect.appendChild(italicOption);
fontStyleSelect.appendChild(boldOption);
fontStyleSelect.appendChild(underlineOption);

fontStyleSelect.style.border = 'none';
fontStyleSelect.style.borderRadius = '40px';
fontStyleSelect.style.background = '#DFF1DD';
fontStyleSelect.style.display = 'flex';
fontStyleSelect.style.padding = '5px 12px';
fontStyleSelect.style.justifyContent = 'center';
fontStyleSelect.style.border = 'none';


const initialConfirmButton = document.createElement('button');
initialConfirmButton.textContent = '✓';
initialConfirmButton.style.display = 'inline-block';
initialConfirmButton.style.marginLeft = '10px';

initialConfirmButton.addEventListener('click', () => {
  label.contentEditable = false;
  initialConfirmButton.remove();
  fontStyleSelect.remove();
  fontSizeInput.remove();
  fontSelect.remove();
  colorInput.remove();
  colorValue.remove();
  buttons.forEach(button => button.remove());
  label.style.cursor = 'move';
});


label.addEventListener('dblclick', () => {
  if (!labelContainer.querySelector('button')) {
    rightPanelDiv.innerHTML='';
    rightPanelDiv.appendChild(fontSelect);
    rightPanelDiv.appendChild(fontSizeInput);
    rightPanelDiv.appendChild(colorInput);
    rightPanelDiv.appendChild(colorValue);
    rightPanelDiv.appendChild(fontSizeInput);
    rightPanelDiv.appendChild(fontStyleSelect);
    buttons.forEach(button => rightPanelDiv.appendChild(button));
    labelContainer.appendChild(initialConfirmButton);
    label.contentEditable = true;
    label.style.cursor = 'text';

    const confirmButton = document.createElement('button');
    confirmButton.textContent = '✓';
    confirmButton.style.display = 'inline-block';
    confirmButton.style.marginLeft = '10px';

    confirmButton.addEventListener('click', () => {
      label.contentEditable = false;
      initialLabelState = label.textContent;
      confirmButton.remove();
      fontStyleSelect.remove();
      fontSizeInput.remove();
      fontSelect.remove();
      buttons.forEach(button => button.remove());
      label.style.cursor = 'move';
      rightPanelDiv.style.flexDirection = 'row';

      buttons[0].addEventListener('click', () => {
        label.textContent = initialLabelState;
      });
    });

  }

});


const rightPanelDiv=document.querySelector('.right-panel')
rightPanelDiv.innerHTML='';
rightPanelDiv.appendChild(label);

const fontSizeInput = document.createElement('input');
fontSizeInput.type = 'number';
fontSizeInput.min = '12';
fontSizeInput.max = '48';
fontSizeInput.value = '24';
fontSizeInput.addEventListener('input', () => {
    label.style.fontSize = `${fontSizeInput.value}px`;
});

fontSizeInput.style.border = 'none';
fontSizeInput.style.borderRadius = '40px';
fontSizeInput.style.background = '#DFF1DD';
fontSizeInput.style.display = 'flex';
fontSizeInput.style.padding = '5px 12px';
fontSizeInput.style.justifyContent = 'center';
fontSizeInput.style.border = 'none';

const fontSelect = document.createElement('select');
fontSelect.addEventListener('change', () => {
    label.style.fontFamily = fontSelect.value;
});

const fonts = ['Arial', 'Verdana', 'Helvetica', 'Times New Roman', 'Courier New'];
fonts.forEach(font => {
    const option = document.createElement('option');
    option.value = font;
    option.textContent = font;
    fontSelect.appendChild(option);
});

fontSelect.style.borderRadius = '40px';
fontSelect.style.background = '#DFF1DD';
fontSelect.style.display = 'flex';
fontSelect.style.padding = '5px 12px';
fontSelect.style.justifyContent = 'center';
fontSelect.style.border = 'none';

rightPanelDiv.appendChild(fontSelect);

//color select
const colorInput = document.createElement('input');
colorInput.type = 'color';
colorInput.addEventListener('input', () => {
    label.style.color = colorInput.value;
    colorValue.textContent = colorInput.value;
});

const colorValue = document.createElement('span');
colorValue.textContent = colorInput.value;

rightPanelDiv.appendChild(colorInput);
rightPanelDiv.appendChild(colorValue);

// letter case

const buttonStyles = 'border-radius: 10px; background: #D9D9D9; width: 30px; height: 30px;';
const activeButtonStyles = 'background: #DFF1DD;';

let initialLabelState = label.textContent; // Preserve initial label state

const buttons = ['-', 'АБ', 'аб', 'Аб'].map((text, index) => {
  const button = document.createElement('button');
  button.textContent = text;
  button.style.cssText = buttonStyles;

  if (index === 0) {
    button.style.cssText += activeButtonStyles;
  }

  button.addEventListener('click', () => {
    buttons.forEach(btn => btn.style.cssText = buttonStyles);
    button.style.cssText += activeButtonStyles;

    switch (text) {
      case '-':
        label.textContent = initialLabelState;
        break;
      case 'АБ':
        label.textContent = label.textContent.toUpperCase();
        break;
      case 'аб':
        label.textContent = label.textContent.toLowerCase();
        break;
      case 'Аб':
        label.textContent = label.textContent.split(' ').map(word => word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()).join(' ');
        break;
    }
  });

  return button;
});

rightPanelDiv.appendChild(fontSizeInput);
rightPanelDiv.appendChild(fontStyleSelect);
rightPanelDiv.append(...buttons);
labelContainer.appendChild(label);
labelContainer.appendChild(initialConfirmButton);
imageContainer.appendChild(labelContainer);



  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  labelContainer.addEventListener('mousedown', dragStart);

document.addEventListener('mouseup', dragEnd);
document.addEventListener('mousemove', drag);

function dragStart(e) {
    if (e.target === label && label.contentEditable === 'false') {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;

      isDragging = true;
    }
}

function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;

    isDragging = false;
}

function drag(e) {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      xOffset = currentX;
      yOffset = currentY;

      setTranslate(currentX, currentY, labelContainer);
    }
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}


label.addEventListener('contextmenu', (event) => {
  if (labelContainer.querySelector('button')) {
    return;
  }

  if (document.querySelector('.context-menu')) {
    return;
  }

  event.preventDefault();

  const contextMenu = document.createElement('ul');
  contextMenu.classList.add('context-menu');
  contextMenu.style.position = 'absolute';
  contextMenu.style.top = `${event.clientY}px`;
  contextMenu.style.left = `${event.clientX}px`;
  contextMenu.style.listStyle = 'none';
  contextMenu.style.padding = '6px';
  contextMenu.style.backgroundColor = '#DFF1DD';
  contextMenu.style.border = '1px solid #ccc';
  contextMenu.style.borderRadius = '10px';
  contextMenu.style.cursor = 'pointer';

contextMenu.addEventListener('mouseover', () => {
  contextMenu.style.backgroundColor = '#C5D8C3';
});
contextMenu.addEventListener('mouseout', () => {
  contextMenu.style.backgroundColor = '#F4F4F4';
});
contextMenu.addEventListener('mousedown', () => {
  contextMenu.style.backgroundColor = '#9FAD9E';
});
contextMenu.addEventListener('mouseup', () => {
  contextMenu.style.backgroundColor = '#C5D8C3';
});

  const deleteOption = document.createElement('li');
  deleteOption.textContent = 'Удалить';
  deleteOption.addEventListener('click', () => {
    label.remove();
    contextMenu.remove();
  });

  contextMenu.appendChild(deleteOption);
  document.body.appendChild(contextMenu);

  document.addEventListener('click', (event) => {
    if (event.target !== contextMenu && !contextMenu.contains(event.target)) {
      contextMenu.remove();
    }
  });
});

});



//function to delete current picture

const garbageButton = document.querySelector('#garbage-button');

garbageButton.addEventListener('click', () => {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      imageContainer.innerHTML = '';
      imageButtons.style.display = 'none';
      imageName.style.display = 'none';
      imageButton.style.display = 'none';
      Swal.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      )
    }
  })
});



const copyImageButton = document.querySelector('#copy-image-button');

copyImageButton.addEventListener('click', () => {
  if (!imageContainer.querySelector('img')) {
    Swal.fire({
      icon: 'error',
      title: 'Ошибка',
      text: 'Добавьте изображение перед копированием'
    });
    return;
  }

  html2canvas(imageContainer)
    .then(canvas => {
      canvas.toBlob(blob => {
        const data = [new ClipboardItem({ 'image/png': blob })];
        navigator.clipboard.write(data)
          .then(() => Swal.fire('Успех', 'Изображение скопировано в буфер обмена', 'success'))
          .catch(error => Swal.fire('Ошибка', error.message, 'error'));
      });
    })
    .catch(error => Swal.fire('Ошибка', error.message, 'error'));
});



const downloadImageButton = document.querySelector('#download-image-button');

downloadImageButton.addEventListener('click', () => {
  const canvasElement = imageContainer.querySelector('canvas');
  if (canvasElement) {
      const format = prompt('Введите формат файла (png, jpeg, webp):', 'png');
      if (format === 'png' || format === 'jpeg' || format === 'webp') {

          const saveCanvas = document.createElement('canvas');
          saveCanvas.width = canvasElement.width;
          saveCanvas.height = canvasElement.height;
          const ctxSaveCanvas = saveCanvas.getContext('2d');
          ctxSaveCanvas.drawImage(canvasElement, 0, 0);

          const labels = imageContainer.querySelectorAll('[contenteditable="false"]');
          labels.forEach(label => {
              const labelRect = label.getBoundingClientRect();
              const canvasRect = canvasElement.getBoundingClientRect();
              const xLabelPosition = labelRect.left - canvasRect.left;
              const yLabelPosition = labelRect.top - canvasRect.top;
              ctxSaveCanvas.font= `${label.style.fontSize} ${getComputedStyle(label).fontFamily}`;
              ctxSaveCanvas.fillStyle= label.style.color;
              ctxSaveCanvas.fillText(label.textContent,xLabelPosition,yLabelPosition);
          });

          saveCanvas.toBlob(
              blob => {
                  const link= document.createElement('a');
                  link.href= URL.createObjectURL(blob);
                  link.download= `image.${format}`;
                  link.click();
              },
              `image/${format}`
          );
      } else {
          alert('Неверный формат файла');
      }
  }
});


const saveButton = document.querySelector('#saveButton');
saveButton.addEventListener('click', () => {
  const value = saveButton.getAttribute("data-state");
  const canvasElement = imageContainer.querySelector('canvas');
  if (canvasElement) {
      const format = prompt('Введите формат файла (png, jpeg, webp):', 'png');
      if (format === 'png' || format === 'jpeg' || format === 'webp') {

          const saveCanvas = document.createElement('canvas');
          saveCanvas.width = canvasElement.width;
          saveCanvas.height = canvasElement.height;
          const ctxSaveCanvas = saveCanvas.getContext('2d');
          ctxSaveCanvas.drawImage(canvasElement, 0, 0);

          const labels = imageContainer.querySelectorAll('[contenteditable="false"]');
          labels.forEach(label => {
              const labelRect = label.getBoundingClientRect();
              const canvasRect = canvasElement.getBoundingClientRect();
              const xLabelPosition = labelRect.left - canvasRect.left;
              const yLabelPosition = labelRect.top - canvasRect.top;
              ctxSaveCanvas.font= `${label.style.fontSize} ${getComputedStyle(label).fontFamily}`;
              ctxSaveCanvas.fillStyle= label.style.color;
              ctxSaveCanvas.fillText(label.textContent,xLabelPosition,yLabelPosition);
          });

          saveCanvas.toBlob(
            async blob => {
                try {
                    const formData = new FormData();
                    formData.append('upload', blob, `image.${format}`);
                    
                    const response = await fetch('/api/img', {
                        method: 'POST',
                        body: formData
                    });
                    
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    
                    const jsonResponse = await response.json();
                    
                    if (jsonResponse.uploaded) {
                        console.log('Image uploaded successfully: ', jsonResponse.url);
                        console.log('value: ',value);
                        if (value !== '') {
                          deleteImageByUrl(value);
                        }
                    }
                    
                    else {
                        console.log('Image upload failed: ', jsonResponse.error);
                    }
                } catch (error) {
                    console.error('There has been a problem with your fetch operation: ', error);
                }
            },
            `image/${format}`
        );
      } else {
          alert('Неверный формат файла');
      }
  }
});


const pencilButton = document.querySelector('#pencil-image-button');
const rightPanel = document.querySelector('.right-panel');
let canvasLayerExists = false;
let isDrawing = false;

pencilButton.addEventListener('click', () => {
  if (canvasLayerExists) {
    return;
  }

  const canvas = imageContainer.querySelector('canvas');
  if (!canvas) {
    Swal.fire({
      icon: 'error',
      title: 'Ошибка',
      text: 'Добавьте изображение перед изменением размера'
    });
    return;
  }

  const originalWidth = canvas.width;
  const originalHeight = canvas.height;

  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;

  let lastX = 0;
  let lastY = 0;

  function draw(e) {
    if (!isDrawing) return;
    const scaleX = originalWidth / canvas.offsetWidth;
    const scaleY = originalHeight / canvas.offsetHeight;
    ctx.beginPath();
    ctx.moveTo(lastX * scaleX, lastY * scaleY);
    ctx.lineTo(e.offsetX * scaleX, e.offsetY * scaleY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
  }

  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
    console.log('isDrawing:', isDrawing);
  });

  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    console.log('isDrawing:', isDrawing);
  });
  canvas.addEventListener('mouseout', () => {
    isDrawing = false;
    console.log('isDrawing:', isDrawing);
  });

  canvasLayerExists = true;
});

// Обработчики для других кнопок
labelButton.addEventListener('click', () => {
  isDrawing = false;
  console.log('isDrawing:', isDrawing);
});

cropButton.addEventListener('click', () => {
  isDrawing = false;
  console.log('isDrawing:', isDrawing);
});



//function to delete background in one click
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

document.getElementById('back-eraser-button').addEventListener('click', function() {
    var canvas = document.querySelector('.image-container canvas');
    if (canvas) {
        var dataURL = canvas.toDataURL('image/png');
        var blob = dataURLtoBlob(dataURL);
        var formData = new FormData();
        formData.append('image', blob);
        fetch('/remove_background', {
            method: 'POST',
            body: formData
        }).then(function(response) {
            if(response.ok) {
                return response.blob();
            }
            throw new Error('Network response was not ok.');
        }).then(function(myBlob) {
            var objectURL = URL.createObjectURL(myBlob);
            var img = new Image();
            img.onload = function() {
                var newCanvas = document.createElement('canvas');
                newCanvas.width = img.width;
                newCanvas.height = img.height;
                var ctx = newCanvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                var container = document.querySelector('.image-container');
                container.removeChild(canvas);
                container.appendChild(newCanvas);
            };
            img.src = objectURL;
        });
    } else {
        console.log('Canvas element not found');
    }
});



// ability to zoom-in and zoom-out image

const zoomInButton = document.querySelector('.right-buttons button:nth-child(1)');
const zoomOutButton = document.querySelector('.right-buttons button:nth-child(2)');
let zoomLevel = 1;

zoomInButton.addEventListener('click', () => {
    zoomLevel += 0.1;
    imageContainer.style.transform = `scale(${zoomLevel})`;
});

zoomOutButton.addEventListener('click', () => {
    zoomLevel -= 0.1;
    imageContainer.style.transform = `scale(${zoomLevel})`;
});



//document.addEventListener('DOMContentLoaded', function() {
//      var img = document.querySelector('.image-container img');
//
//      if (img) {
//          img.onload = function() {
//              drawHistogram(img);
//          }
//      }
//    });
//
//    function drawHistogram(img) {
//        var canvas = document.getElementById('histogram');
//        var ctx = canvas.getContext('2d');
//
//        ctx.drawImage(img, 0, 0, img.width, img.height);
//
//        var imageData = ctx.getImageData(0, 0, img.width, img.height);
//        var data = imageData.data;
//
//        var histogram = new Array(256).fill(0);
//
//        for (var i = 0; i < data.length; i += 4) {
//            var brightness = Math.round(0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2]);
//            histogram[brightness]++;
//        }
//
//        ctx.clearRect(0, 0, canvas.width, canvas.height);
//
//        for (var i = 0; i < histogram.length; i++) {
//            ctx.fillRect(i, canvas.height, 1, -histogram[i]);
//        }
//    }



// dropzone image functionality:

const dropZone = document.querySelector('.dropzone');

dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  event.stopPropagation();
  dropZone.classList.remove('dragover');
  handleFile(event.dataTransfer.files[0]);
});

input.addEventListener('change', (event) => {
  handleFile(event.target.files[0]);
});

function handleFile(file) {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        imageContainer.innerHTML = '';
        imageContainer.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        imageButtons.style.display = 'flex';
        imageName.textContent = file.name;
        imageName.style.display = 'block';
        imageButton.style.display = 'block';
        dropZone.style.display = 'none';
        //drawHistogram(img);
      }
    };
    reader.readAsDataURL(file);
  } else {
    imageButtons.style.display = 'none';
    imageName.style.display = 'none';
    imageButton.style.display = 'none';
  }
}





//Filter function

const filterButton = document.querySelector('#filterButton');
let originalImage = null;
let saturationSlider = null;
let contrastSlider = null;
let brightnessSlider = null;
let hueRotateSlider = null;
let sepiaSlider = null;
let blurSlider = null;
let canvas = null;

filterButton.addEventListener('click', () => {
    canvas = imageContainer.querySelector('canvas');
    if (!canvas) {
        Swal.fire({
            icon: 'error',
            title: 'Ошибка',
            text: 'Добавьте изображение перед применением фильтра'
        });
        return;
    }

    // Сохраните исходное изображение
    if (!originalImage) {
        originalImage = new Image();
        originalImage.src = canvas.toDataURL();
    }

    // Очистите правую панель и добавьте настройки фильтра
    rightPanel.innerHTML = '';
    const filterSettings = document.createElement('div');
    filterSettings.innerHTML = `
      <div class="top-title-settings">
          <img src="/static/svg/small-image-filter.svg" alt="small-image-filter">
          <span>Настройки фильтра</span>
      </div>
      <div class="line"></div>
      <div class="filter-settings">
          <div class="slider-container">
              <label for="saturation" style="position: absolute; top: -20px;">Насыщенность</label>
              <input type="range" min="0" max="2" value="1" step="0.1" id="saturation">
              <span class="value" id="saturationValue">1</span>
          </div>
          <div class="slider-container">
              <label for="contrast" style="position: absolute; top: -20px;">Контрастность</label>
              <input type="range" min="0" max="2" value="1" step="0.1" id="contrast">
              <span class="value" id="contrastValue">1</span>
          </div>
          <div class="slider-container">
              <label for="brightness" style="position: absolute; top: -20px;">Яркость</label>
              <input type="range" min="0" max="2" value="1" step="0.1" id="brightness">
              <span class="value" id="brightnessValue">1</span>
          </div>
          <div class="slider-container">
              <label for="hue-rotate" style="position: absolute; top: -20px;">Оттенок</label>
              <input type="range" min="0" max="360" value="0" step="1" id="hue-rotate">
              <span class="value" id="hueRotateValue">0</span>
          </div>
          <div class="slider-container">
              <label for="sepia" style="position: absolute; top: -20px;">Сепия</label>
              <input type="range" min="0" max="1" value="0" step="0.1" id="sepia">
              <span class="value" id="sepiaValue">0</span>
          </div>
          <div class="slider-container">
              <label for="blur" style="position: absolute; top: -20px;">Размытие</label>
              <input type="range" min="0" max="20" value="0" step="1" id="blur">
              <span class="value" id="blurValue">0</span>
          </div>
          <div id="presetsContainer"></div>
      </div>
    `;
    rightPanel.appendChild(filterSettings);


    const presets = {
      'Normal': { saturation: 1, contrast: 1, brightness: 1, hueRotate: 0, sepia: 0, blur: 0 },
      '1977': { saturation: 1.4, contrast: 1, brightness: 1, hueRotate: -30, sepia: 0.5, blur: 0 },
      'Nashville': { saturation: 1.6, contrast: 1, brightness: 1.2, hueRotate: -15, sepia: 0.4, blur: 0 },
      'X-Pro II': { saturation: 1, contrast: 1.3, brightness: 1.1, hueRotate: 0, sepia: 0.3, blur: 0 },
      'Lomo-fi': { saturation: 1, contrast: 1.5, brightness: 0.8, hueRotate: 0, sepia: 0.3, blur: 0 },
      'Earlybird': { saturation: 1, contrast: 1.25, brightness: 0.9, hueRotate: -10, sepia: 0.4, blur: 0 },
      'Sutro': { saturation: 1, contrast: 1.2, brightness: 0.85, hueRotate: -10, sepia: 0.3, blur: 0 },
      'Toaster': { saturation: 1, contrast: 1.5, brightness: 0.9, hueRotate: 0, sepia: 0.2, blur: 0 },
      'Brannan': { saturation: 1, contrast: 1.25, brightness: 1, hueRotate: 0, sepia: 0.5, blur: 0 },
      'Inkwell': { saturation: 1, contrast: 1.2, brightness: 1, hueRotate: 0, sepia: 0, blur: 0 },
      'Walden': { saturation: 1, contrast: 1.1, brightness: 1.1, hueRotate: -10, sepia: 0.3, blur: 0 },
      'Hefe': { saturation: 1, contrast: 1.5, brightness: 0.9, hueRotate: 0, sepia: 0.3, blur: 0 },
      'Valencia': { saturation: 1, contrast: 1.1, brightness: 1.1, hueRotate: 0, sepia: 0.15, blur: 0 },
      'Stinson': { saturation: 1, contrast: 1.2, brightness: 1.1, hueRotate: 0, sepia: 0.2, blur: 0 },
      'Vesper': { saturation: 1, contrast: 1.3, brightness: 1.1, hueRotate: 0, sepia: 0.2, blur: 0 },
      'Aden': { saturation: 1, contrast: 1.2, brightness: 1.0, hueRotate: 0, sepia: 0.2, blur: 0 }
  };

  const presetsContainer = document.getElementById('presetsContainer');
  if (presetsContainer) {
      for (const presetName in presets) {
          const presetButton = document.createElement('button');
          presetButton.textContent = presetName;
          presetButton.addEventListener('click', () => {
              const preset = presets[presetName];
              saturationSlider.value = preset.saturation;
              contrastSlider.value = preset.contrast;
              brightnessSlider.value = preset.brightness;
              hueRotateSlider.value = preset.hueRotate;
              sepiaSlider.value = preset.sepia;
              blurSlider.value = preset.blur;
              updateFilter();
             // Удалите класс active со всех кнопок
            const buttons = presetsContainer.querySelectorAll('button');
            buttons.forEach(button => button.classList.remove('active'));

            // Добавьте класс active на нажатую кнопку
            presetButton.classList.add('active');
          });

          if (presetName === 'Normal') {
            presetButton.classList.add('active');
          }

          presetsContainer.appendChild(presetButton);
      }
  } else {
      console.error("Element with ID 'presetsContainer' not found.");
  }


    // Добавьте обработчики событий для ползунков настройки фильтра
    saturationSlider = document.querySelector('#saturation');
    const saturationValue = document.querySelector('#saturationValue');
    saturationSlider.addEventListener('input', () => {
        saturationValue.textContent = saturationSlider.value;
        updateFilter();
    });

    contrastSlider = document.querySelector('#contrast');
    const contrastValue = document.querySelector('#contrastValue');
    contrastSlider.addEventListener('input', () => {
        contrastValue.textContent = contrastSlider.value;
        updateFilter();
    });

    brightnessSlider = document.querySelector('#brightness');
    const brightnessValue = document.querySelector('#brightnessValue');
    brightnessSlider.addEventListener('input', () => {
        brightnessValue.textContent = brightnessSlider.value;
        updateFilter();
    });

    hueRotateSlider = document.querySelector('#hue-rotate');
    const hueRotateValue = document.querySelector('#hueRotateValue');
    hueRotateSlider.addEventListener('input', () => {
        hueRotateValue.textContent = hueRotateSlider.value;
        updateFilter();
    });

    sepiaSlider = document.querySelector('#sepia');
    const sepiaValue = document.querySelector('#sepiaValue');
    sepiaSlider.addEventListener('input', () => {
        sepiaValue.textContent = sepiaSlider.value;
        updateFilter();
    });

    blurSlider = document.querySelector('#blur');
    const blurValue = document.querySelector('#blurValue');
    blurSlider.addEventListener('input', () => {
        blurValue.textContent = blurSlider.value;
        updateFilter();
    });

});

function updateFilter() {
  const saturation = saturationSlider.value;
  const contrast = contrastSlider.value;
  const brightness = brightnessSlider.value;
  const hueRotate = hueRotateSlider.value;
  const sepia = sepiaSlider.value;
  const blur = blurSlider.value;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.filter = `saturate(${saturation}) contrast(${contrast}) brightness(${brightness})
                hue-rotate(${hueRotate}deg) sepia(${sepia}) blur(${blur}px)`;
  ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

  saturationValue.textContent = saturation;
  contrastValue.textContent = contrast;
  brightnessValue.textContent = brightness;
  hueRotateValue.textContent = hueRotate;
  sepiaValue.textContent = sepia;
  blurValue.textContent = blur;
}

function resetFilter() {
  saturationSlider.value = 1;
  contrastSlider.value = 1;
  brightnessSlider.value = 1;
  hueRotateSlider.value = 0;
  sepiaSlider.value = 0;
  blurSlider.value = 0;
  updateFilter();
}
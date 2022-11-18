tinymce.PluginManager.add('dropzone', function(editor, url) {

  // plugin configuration options
  let settings = editor.getParam('dropzone');
  let dropzoneAction = null;
  if (settings && settings.action) {
    dropzoneAction = settings.action;
  }

  let dropzoneScripts = [];
  if (settings && settings.js) {
    dropzoneScripts.push(settings.js);
  }

  let dropzoneStyles = [];
  if (settings && settings.css) {
    dropzoneStyles.push(settings.css);
  }

  let dropzoneTitle = tinymce.util.I18n.translate('Files');
  if (settings && settings.title) {
    dropzoneTitle = settings.title;
  }

  let dropzoneFiles = [];
  if (settings && settings.files) {
    dropzoneFiles = settings.files;
  }

  let dropzoneConfig = {};
  if (settings && settings.config) {
    dropzoneConfig = settings.config;
  }

  let dropzoneIcon = 'upload';
  if (settings && settings.icon) {
    dropzoneIcon = settings.icon;
  }

  let dropzoneOkTitle = tinymce.util.I18n.translate('OK');
  if (settings && settings.okTitle) {
    dropzoneOkTitle = settings.okTitle;
  }

  let dropzoneRemoveTooltip = tinymce.util.I18n.translate('Remove');
  if (settings && settings.removeTooltip) {
    dropzoneRemoveTooltip = settings.removeTooltip;
  }

  let dropzoneDownloadTooltip = tinymce.util.I18n.translate('Download');
  if (settings && settings.downloadTooltip) {
    dropzoneDownloadTooltip = settings.downloadTooltip;
  }

  let dropzoneInsertLinkTooltip = tinymce.util.I18n.translate('Insert link');
  if (settings && settings.insertLinkTooltip) {
    dropzoneInsertLinkTooltip = settings.insertLinkTooltip;
  }

  let dropzoneInsertImageTooltip = tinymce.util.I18n.translate('Insert image');
  if (settings && settings.insertImageTooltip) {
    dropzoneInsertImageTooltip = settings.insertImageTooltip;
  }

  let dropzoneRemoveConfirmation = tinymce.util.I18n.translate('Links to the file will be corrupted.');
  if (settings && settings.removeConfirmation) {
    dropzoneRemoveConfirmation = settings.removeConfirmation;
  }

  // add button to tinimce
  editor.ui.registry.addButton('dropzone', {
    icon: dropzoneIcon,
    tooltip: dropzoneTitle,
    onAction: function() {
      if (dropzoneAction == null) {
        editor.notificationManager.open({
          text: 'Set dropzone action in config.',
          type: 'error'
        });
      } else {
        openEditor();
      }
    }
  });

  // open window with editor
  let openEditor = function() {
    let scripts = '';
    for (let i = 0; i < dropzoneScripts.length; i++) {
      scripts += '<script type="text/javascript" src="' + dropzoneScripts[i] + '"></script>';
    }

    let styles = '';
    for (let i = 0; i < dropzoneStyles.length; i++) {
      styles += '<link rel="stylesheet" type="text/css" href="' + dropzoneStyles[i] + '">'
    }

    let iframeContent = '<!DOCTYPE html>\
      <html>\
      <head>'
        + scripts + styles +
        '<style>\
          .dropzone {\
            border: none;\
            padding: 0;\
            text-align: center;\
            min-height: 80px;\
          }\
          \
          .dropzone .dz-message {\
            border: 2px dashed #aaa;\
            padding: 2em 0;\
            margin: 0;\
            background-color: #eee;\
          }\
          \
          .dropzone.dz-started .dz-message {\
            display: block;\
          }\
          \
          .dropzone .dz-preview {\
            margin: 10px;\
          }\
          \
          .dz-image {\
            width: 400px !important;\
            height: auto !important;\
          }\
          .dropzone .dz-preview .dz-error-message {\
            left: 33% !important;\
          }\
          \
          .dz-image img {\
            width: 100%;\
            height: 100%;\
            object-fit: cover;\
          }\
          .dz-filename span {\
            max-width: 100%;\
            display: block;\
            overflow: hidden;\
            \
          }\
          .dz-filename span:hover {\
            overflow: visible;\
            white-space: normal;\
            word-wrap: break-word;\
          }\
          .dropzone .dz-preview .dz-remove,\
          .dropzone .dz-preview .dz-upload,\
          .dropzone .dz-preview .dz-link,\
          .dropzone .dz-preview .dz-image-link {\
            cursor: pointer;\
            display: inline-block;\
            text-align: center;\
          }\
          \
          .dropzone .dz-preview .dz-remove:not(:hover):not(:focus):not(:active),\
          .dropzone .dz-preview .dz-upload:not(:hover):not(:focus):not(:active),\
          .dropzone .dz-preview .dz-link:not(:hover):not(:focus):not(:active),\
          .dropzone .dz-preview .dz-image-link:not(:hover):not(:focus):not(:active) {\
            opacity: .5;\
          }\
          \
          .dropzone .dz-preview .dz-remove *,\
          .dropzone .dz-preview .dz-upload *,\
          .dropzone .dz-preview .dz-link *,\
          .dropzone .dz-preview .dz-image-link * {\
            cursor: pointer;\
          }\
          \
          .dropzone .dz-preview.threeLinks .dz-remove,\
          .dropzone .dz-preview.threeLinks .dz-upload,\
          .dropzone .dz-preview.threeLinks .dz-link,\
          .dropzone .dz-preview.threeLinks .dz-image-link {\
            width: 33.3%;\
          }\
          \
          .dropzone .dz-preview.fourLinks .dz-remove,\
          .dropzone .dz-preview.fourLinks .dz-upload,\
          .dropzone .dz-preview.fourLinks .dz-link,\
          .dropzone .dz-preview.fourLinks .dz-image-link {\
            width: 25%;\
          }\
          \
          .dropzone .dz-preview.used .dz-remove path {\
            fill: red;\
          }\
        </style>\
      </head>\
      <body style="margin: 0">\
        <form id="dropzoneElement" action="' + dropzoneAction + '"></form>\
        <script type="text/javascript">\
          window.addEventListener("load", () => {\
            function initLinks(di, file, downloadUrl, name, type, used) {\
              let removeLink = \'<a href="javascript:void(0)" class="dz-remove" title="\' + window.tinymceRemoveTooltip + \'">\
                <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
                  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
                    <path d="M17.2512112,8.15745915 L13.421875,12 L17.2512112,15.8425408 C17.6390628,16.2317298 17.6385208,16.8614792 17.25,17.25 C16.8614792,17.6385208 16.2317298,17.6390628 15.8425408,17.2512112 L12,13.421875 L8.15745915,17.2512112 C7.7682702,17.6390628 7.13852082,17.6385208 6.75,17.25 C6.36147918,16.8614792 6.36093722,16.2317298 6.74878876,15.8425408 L10.578125,12 L6.74878876,8.15745915 C6.36093722,7.7682702 6.36147918,7.13852082 6.75,6.75 C7.13852082,6.36147918 7.7682702,6.36093722 8.15745915,6.74878876 L12,10.578125 L15.8425408,6.74878876 C16.2317298,6.36093722 16.8614792,6.36147918 17.25,6.75 C17.6385208,7.13852082 17.6390628,7.7682702 17.2512112,8.15745915 Z" fill="#000000"></path>\
                  </g>\
                </svg>\
              </a>\';\
              file["_removeLinkCustom"] = Dropzone.createElement(removeLink);\
              file["previewElement"].appendChild(file["_removeLinkCustom"]);\
              file["_removeLinkCustom"].addEventListener("click",\
                () => {\
                  if (!used || confirm(window.tinymceRemoveConfirmation)) {\
                    di.removeFile(file);\
                    document.querySelector(\'.dz-message\').style.display = \'block\';\
                    for (let i = 0; i < window.tinymceFiles.length; i++) {\
                      window.tinymceFiles.splice(i, 1);\
                      break;\
                    }\
                  }\
                }\
              );\
              let downloadLink = \'<a href="\' + downloadUrl + \'" download target="_blank" class="dz-upload" title="\' + window.tinymceDownloadTooltip + \'">\
                <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
                  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
                    <path d="M5,16 L19,16 C20.1045695,16 21,16.8954305 21,18 L21,20 C21,21.1045695 20.1045695,22 19,22 L5,22 C3.8954305,22 3,21.1045695 3,20 L3,18 C3,16.8954305 3.8954305,16 5,16 Z M5,18 L5,20 L19,20 L19,18 L5,18 Z M15,18 L17,18 L17,20 L15,20 L15,18 Z M11,11.5857864 L8.70710678,9.29289322 C8.31658249,8.90236893 7.68341751,8.90236893 7.29289322,9.29289322 C6.90236893,9.68341751 6.90236893,10.3165825 7.29289322,10.7071068 L11.2928932,14.7071068 C11.6834175,15.0976311 12.3165825,15.0976311 12.7071068,14.7071068 L16.7071068,10.7071068 C17.0976311,10.3165825 17.0976311,9.68341751 16.7071068,9.29289322 C16.3165825,8.90236893 15.6834175,8.90236893 15.2928932,9.29289322 L13,11.5857864 L13,4 C13,3.44771525 12.5522847,3 12,3 C11.4477153,3 11,3.44771525 11,4 L11,11.5857864 Z" fill="#000000" fill-rule="nonzero"></path>\
                  </g>\
                </svg>\
              </a>\';\
              file["_downloadLink"] = Dropzone.createElement(downloadLink);\
              file["previewElement"].appendChild(file["_downloadLink"]);\
              let classLinks = "threeLinks";\
              if (type.indexOf("image/") === 0) {\
                let imageLink = \'<a href="javascript:void(0)" class="dz-image-link" title="\' + window.tinymceInsertImageTooltip + \'">\
                  <?xml version="1.0" encoding="UTF-8"?>\
                  <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
                    <!-- Generator: Sketch 51.2 (57519) - http://www.bohemiancoding.com/sketch -->\
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
                      <path d="M5,15.7393398 L8.26966991,12.4696699 C8.56256313,12.1767767 9.03743687,12.1767767 9.33033009,12.4696699 L11.9,15.0393398 L16.0030032,10.9363366 C16.2958965,10.6434434 16.7707702,10.6434434 17.0636634,10.9363366 L19,12.8726732 L19,5 L5,5 L5,15.7393398 Z M5,17.8606602 L5,19 L7.93933983,19 L10.8393398,16.1 L8.8,14.0606602 L5,17.8606602 Z M19,14.9939935 L16.5333333,12.5273268 L10.0606602,19 L19,19 L19,14.9939935 Z M4,3 L20,3 C20.5522847,3 21,3.44771525 21,4 L21,20 C21,20.5522847 20.5522847,21 20,21 L4,21 C3.44771525,21 3,20.5522847 3,20 L3,4 C3,3.44771525 3.44771525,3 4,3 Z M10,11 C11.1045695,11 12,10.1045695 12,9 C12,7.8954305 11.1045695,7 10,7 C8.8954305,7 8,7.8954305 8,9 C8,10.1045695 8.8954305,11 10,11 Z" fill="#000000" fill-rule="nonzero"></path>\
                    </g>\
                  </svg>\
                </a>\';\
                file["_imageLink"] = Dropzone.createElement(imageLink);\
                file["_imageLink"].addEventListener("click",\
                  () => {\
                    window.tinymceEditor.insertContent(\'<img src="\' + downloadUrl + \'">\');\
                    window.tinymceSubmit();\
                  }\
                );\
                file["previewElement"].appendChild(file["_imageLink"]);\
                classLinks = "fourLinks";\
              }\
              file["previewElement"].classList.add(classLinks);\
              if (used) {\
                file["previewElement"].classList.add("used");\
              }\
            }\
            let element = document.querySelector("#dropzoneElement");\
            element.classList.add("dropzone");\
            let dropzoneConfig = {};\
            for (let key in window.tinymceDropzoneConfig) {\
              dropzoneConfig[key] = window.tinymceDropzoneConfig[key];\
            }\
            let configInit = window.tinymceDropzoneConfig.init;\
            let configSuccess = window.tinymceDropzoneConfig.success;\
            dropzoneConfig.init = function() {\
              let files = window.tinymceFiles;\
              for (let i = 0; i < files.length; i++) {\
                let file = files[i];\
                this.emit("addedfile", file);\
                this.emit("thumbnail", file, file.thumbnail);\
                initLinks(this, file, file.url, file.name, file.type, window.tinymceUsedFiles[i]);\
                this.emit("complete", file);\
              }\
              this.on("removedfile", file => {\
                for (let i = 0; i < window.tinymceFiles.length; i++) {\
                  if (window.tinymceFiles[i] == file) {\
                    window.tinymceFiles.splice(i, 1);\
                    break;\
                  }\
                }\
              });\
              if (configInit) {\
                configInit.call(this);\
              }\
            };\
            dropzoneConfig.success = function(file) {\
              if (file.xhr.response) {\
                document.querySelector(\'.dz-message\').style.display = \'none\';\
                let response = JSON.parse(file.xhr.response);\
                let result = {\
                  \'url\': response.url,\
                  \'name\': file.name,\
                  \'type\': file.type,\
                  \'size\': file.size,\
                  \'thumbnail\': \'/assets/img/logo.png\'\
                };\
                if (result.thumbnail) {\
                  setTimeout(() => {this.emit("thumbnail", file, result.thumbnail);});\
                }\
                if (result.url && result.name && result.type) {\
                  initLinks(this, file, result.url, result.name, result.type);\
                }\
                window.tinymceFiles.push(result);\
                if (configSuccess) {\
                  configSuccess.call(this, file);\
                }\
              }\
            };\
            let instance = new Dropzone("#dropzoneElement", dropzoneConfig);\
          });\
        </script>\
      </body>\
      </html>';

    let resultFiles = dropzoneFiles.slice();
    
    // show new window
    let dialog = editor.windowManager.open({
      title: dropzoneTitle,
      body: {
        type: 'panel',
        items: [{
            type: 'iframe',
            name: 'iframe',
            sandboxed: false
          }
        ]
      },
      buttons: [{
        type: 'submit',
        primary: true,
        text: dropzoneOkTitle
      }],
      onSubmit: function onsubmit() {
        submit();
      },
      initialData: {iframe: iframeContent}
    });

    let submit = function() {
      if (settings && settings.files) {
        settings.files.splice(0, settings.files.length);
        for (let i = 0; i < resultFiles.length; i++) {
          settings.files.push(resultFiles[i]);
          editor.insertContent(`<video src="${resultFiles[i].url}" controls="controls"></video>`);
          settings.files.splice(i, 1);
          resultFiles.splice(i, 1);
        }
      }
      dialog.close();
    };
    
    let iframes = document.querySelectorAll('iframe');
    let iframe = iframes[iframes.length - 1];
    let iframeWindow = (iframe.contentWindow || iframe.contentDocument);
    iframeWindow.tinymceEditor = editor;
    iframeWindow.tinymceDialog = dialog;
    iframeWindow.tinymceFiles = resultFiles;
    let usedFiles = {};
    let editorContent = editor.getContent();
    for (let i = 0; i < resultFiles.length; i++) {
      usedFiles[i] = editorContent.indexOf(resultFiles[i].url) != -1;
    }
    iframeWindow.tinymceUsedFiles = usedFiles;
    iframeWindow.tinymceSubmit = submit;
    iframeWindow.tinymceDropzoneConfig = dropzoneConfig;
    iframeWindow.tinymceRemoveTooltip = dropzoneRemoveTooltip;
    iframeWindow.tinymceDownloadTooltip = dropzoneDownloadTooltip;
    iframeWindow.tinymceInsertLinkTooltip = dropzoneInsertLinkTooltip;
    iframeWindow.tinymceInsertImageTooltip = dropzoneInsertImageTooltip;
    iframeWindow.tinymceRemoveConfirmation = dropzoneRemoveConfirmation;
  };
});

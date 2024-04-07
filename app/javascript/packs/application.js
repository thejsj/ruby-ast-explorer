/* eslint no-console:0 */
/* globals CodeMirror $ */

import {
  debounce,
  buildTreeView,
  indentCode,
} from './utils';

document.addEventListener('turbolinks:load', () => {
  const markers = [];

  const editorOptions = {
    mode: 'text/x-ruby',
    matchBrackets: true,
    indentUnit: 2,
    lineNumbers: true,
    theme: 'solarized',
    styleSelectedText: true,
  };

  const astEditorOptions = {
    mode: 'text/x-ruby',
    matchBrackets: true,
    indentUnit: 2,
    theme: 'solarized',
    readOnly: true,
  };


  const editor = CodeMirror.fromTextArea(document.getElementById('editor'), editorOptions);
  const transformEditor = CodeMirror.fromTextArea(document.getElementById('transform-editor'), editorOptions);
  const outputEditor = CodeMirror.fromTextArea(document.getElementById('output-editor'), editorOptions);
  const astEditor = CodeMirror.fromTextArea(document.getElementById('ast-editor'), astEditorOptions);
  const stdoutOutputEditor = CodeMirror.fromTextArea(document.getElementById('std-out-editor'), astEditorOptions);
  window.stdoutOutputEditor = stdoutOutputEditor;

  function indentAll() {
    indentCode(editor);
    indentCode(transformEditor);
    indentCode(outputEditor);
  }

  function refreshCodeMirrror() {
    setTimeout(() => {
      console.log('Refreshing code mirror');
      astEditor.refresh();
      stdoutOutputEditor.refresh();
    }, 1);
  }

  function setSearchParams(newSearch) {
    // Check if the URLSearchParams API is available
    if (window.URLSearchParams) {
      // Create a new URLSearchParams object based on the current URL
      const searchParams = new URLSearchParams(window.location.search);
      // Loop through the newSearch object and set new search parameters
      Object.keys(newSearch).forEach((key) => {
        searchParams.set(key, encodeURIComponent(newSearch[key]));
      });

      // Construct the new URL
      const newUrl = `${window.location.pathname}?${searchParams.toString()}${window.location.hash}`;

      // Use history.pushState to change the URL without refreshing the page
      window.history.pushState({ path: newUrl }, '', newUrl);
    } else {
      console.error('URLSearchParams is not supported in this browser.');
    }
  }

  function updateAstAndOutput(code, transform, shouldBuildTreeView) {
    setSearchParams({ code, transform });
    $.ajax({
      url: '/ast',
      type: 'post',
      data: { code, transform },
      success(data) {
        outputEditor.setValue(data.output);
        stdoutOutputEditor.setValue(data.captured_stdout_output);

        if (shouldBuildTreeView) {
          astEditor.setValue(data.ast);
          buildTreeView(data.treeData);
        }

        if (data.captured_stdout_output.length > 0) {
          $('#stdout-tab').click();
        }
      },
      error() {},
    });
  }

  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.get('code')) {
    editor.setValue(decodeURIComponent(searchParams.get('code')));
  }
  if (searchParams.get('transform')) {
    transformEditor.setValue(decodeURIComponent(searchParams.get('transform')));
  }

  updateAstAndOutput(editor.getValue(), transformEditor.getValue(), true);
  indentAll();
  setTimeout(refreshCodeMirrror, 1000);

  editor.on('change', debounce((cm) => {
    const code = cm.getValue();
    const transform = transformEditor.getValue();
    updateAstAndOutput(code, transform, true);
  }, 250));

  editor.on('cursorActivity', (e) => {
    // Collapse all items first
    const trees = document.querySelectorAll('[role="tree"]');
    for (let i = 0; i < trees.length; i++) {
      trees[i].attributes['aria-expanded'] = 'false';
    }


    const { line } = e.doc.getCursor(); // Cursor line
    const { ch } = e.doc.getCursor(); // Cursor character

    const doc = editor.getDoc();

    let pos = 0;
    for (let index = 0; index <= line; index++) {
      const lineLength = doc.getLine(index).length; // Adding 1 for new line

      pos += lineLength;
    }

    pos += ch;


    const nodes = Array.from(document.querySelectorAll('li')).filter((el) => {
      const { beginPos, endPos } = el.dataset;
      return pos > beginPos && pos < endPos;
    });

    nodes.forEach((node) => {
      // HACK: to open full tree branch
      if (node.parentElement && node.parentElement.parentElement) {
        // node.parentElement.parentElement.click();
        node.parentElement.parentElement.attributes['aria-expanded'] = 'true';
      }
      // node.click();
      // node.style.backgroundColor = 'yellow';
      node.attributes['aria-expanded'] = 'true';
    });
  });


  transformEditor.on('change', debounce((cm) => {
    const transform = cm.getValue();
    const code = editor.getValue();
    updateAstAndOutput(code, transform, false);
  }, 250));

  $('a.nav-link').on('click', refreshCodeMirrror);

  $(document).on('mouseover', '[role="treeitem"]', (event) => {
    const { beginPos, endPos } = event.currentTarget.dataset;

    // Clearing and pushing markers
    markers.forEach((marker) => marker.clear());
    if (beginPos && endPos) {
      const doc = editor.getDoc();
      const markFrom = doc.posFromIndex(beginPos);
      const markTo = doc.posFromIndex(endPos);

      const currentMark = editor.markText(markFrom, markTo, { className: 'styled-background' });
      markers.push(currentMark);
    }

    event.stopPropagation();
  });

  $(document).on('mouseleave', '[role="treeitem"]', () => {
    // Clearing and pushing markers
    markers.forEach((marker) => marker.clear());
  });
});

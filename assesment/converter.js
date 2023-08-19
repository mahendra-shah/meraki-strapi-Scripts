class merakiToStrapiConverter {

    question(merakiData) {
      if (merakiData.component == 'questionExpression') { //
        return {
          "id": "AFca5LpZrs",
          "type": "paragraph",
          "data": {
            "text": `${merakiData.value.replace(/<br>/g, "").replace(/&emsp;/g, '')}` 
          }
        };
      };
    };

    questionCode(merakiData) {
        if (merakiData.component == 'questionCode') { // 
          return {
            "id": "J9kgA2mvSX",
            "type": "code",
            "data": {
              "code": `${merakiData.value.replace(/<br>/g, "\n").replace(/&emsp;/g, '\t')}`
            }
          };
        };
      };  
  
    options(merakiData, solution) {
      if (merakiData.component == 'options') {
        const items = []
        for (let i = 0; i < (merakiData.value.length); i++) {
          const val = {
            "time": Date.now(),
            "blocks": [
                {
                    "id": "k2sYB69cJQ",
                    "type": "paragraph",
                    "data": {
                        "text": `${merakiData.value[i].value.replace(/^.\)/, '')}` // to remove anyletter and ) from string
                    }
                }
            ],
            "version": "2.23.2"
          };
          let id=1+i;
          const opt = {
            "__component": "assessment-option.option",
            "number": id,
            "value": JSON.stringify(val),
            "correct": solution == id ? true : false
          }
          items.push(opt)
        }
        return items;
      };
    };
  
    output(merakiData) {
      if (merakiData.component == 'output') {
        const correct = {
          "time": 1689921657564,
          "blocks": [
              {
                  "id": "IwOlW0rznK",
                  "type": "header",
                  "data": {
                      "text":`${merakiData.value.correct[0].value.replace(/<br>/g, "").replace(/&emsp;/g, '')}`,
                      "level": merakiData.value.correct[0].variant
                  }
              },
              {
                  "id": "c3DLQw9q1w",
                  "type": "header",
                  "data": {
                      "text": `${merakiData.value.correct[1].value.replace(/<br>/g, "").replace(/&emsp;/g, '')}`,
                      "level": merakiData.value.correct[0].variant
                  }
              },
              {
                  "id": "Wa26k6RT7z",
                  "type": "paragraph",
                  "data": {
                      "text": `${merakiData.value.correct[2].value.replace(/<br>/g, "").replace(/&emsp;/g, '')}`
                  }
              }
          ],
          "version": "2.23.2"
        }
        const incorrect = {
          "time": 1689921657564,
          "blocks": [
              {
                  "id": "IwOlW0rznK",
                  "type": "header",
                  "data": {
                      "text":`${merakiData.value.incorrect[0].value.replace(/<br>/g, "").replace(/&emsp;/g, '')}`,
                      "level": merakiData.value.correct[0].variant
                  }
              },
              {
                  "id": "c3DLQw9q1w",
                  "type": "header",
                  "data": {
                      "text": `${merakiData.value.incorrect[1].value.replace(/<br>/g, "").replace(/&emsp;/g, '')}`,
                      "level": merakiData.value.correct[0].variant
                  }
              },
              {
                  "id": "Wa26k6RT7z",
                  "type": "paragraph",
                  "data": {
                      "text": `${merakiData.value.incorrect[2].value.replace(/<br>/g, "").replace(/&emsp;/g, '')}`
                  }
              }
          ],
          "version": "2.23.2"
        }
                
        return {
          // "id": 4,
          "correct": JSON.stringify(correct),
          "incorrect": JSON.stringify(incorrect),
          
        }
      }
    };
  
    image(merakiData) {
      if (merakiData.component == 'image') {
        const ext = merakiData.value.split('.').slice(-1)[0].trim()
        return {
          "id": "4RBYqrY3RK",
          "type": "image",
          "data": {
            "file": {
              "url": merakiData.value,
              "mime": `image/${ext}`,
              "height": 388,
              "width": 596,
              "size": 5.43,
              "alt": "if-statement-intro_flowchart1.png",
              "formats": {
                "small": {
                  "ext": `.${ext}`,
                  "url": merakiData.value,
                  "hash": "small_if_statement_intro_flowchart1_eafdac5e44",
                  "mime": `image/${ext}`,
                  "name": `small_if-statement-intro_flowchart1.${ext}`,
                  "path": null,
                  "size": 34.5,
                  "width": 500,
                  "height": 326
                },
                "thumbnail": {
                  "ext": `.${ext}`,
                  "url": merakiData.value,
                  "hash": "thumbnail_if_statement_intro_flowchart1_eafdac5e44",
                  "mime": `image/${ext}`,
                  "name": `thumbnail_if-statement-intro_flowchart1.${ext}`,
                  "path": null,
                  "size": 9.99,
                  "width": 240,
                  "height": 156
                }
              }
            },
            "caption": merakiData.alt,
            "withBorder": false,
            "stretched": false,
            "withBackground": false
          }
        }
      }
    };
  
  }
  
  module.exports = merakiToStrapiConverter;
  
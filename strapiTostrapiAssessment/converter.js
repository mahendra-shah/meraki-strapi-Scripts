const question = (question) => {
  const parsedInput = JSON.parse(question);
  let modifyQuestion = "";

  parsedInput.blocks.forEach((block) => {
    if (block.type === "paragraph") {
      modifyQuestion += `<p>${block.data.text}</p><p></p>`;
    } else if (block.type === "code") {
      modifyQuestion += `<pre><code>${block.data.code}</code></pre>`;
    } else if (block.type === "image") {
      modifyQuestion += `<img src="${block.data.file.url}"/>`;
    } else if (block.type === "header") {
      modifyQuestion += `<h1>${block.data.text}</h1>`;
    }
  });
  return modifyQuestion;
};

const option = (option, createdAt) => {
  const assessmentOptions = option;
  const modifyOption = [];
  assessmentOptions.forEach((element) => {
    const output = {
      // id: element.id,
      __component: "assessment-options.options",
      number: element.number,
      value: [],
      correct: element.correct,
    };
    if (element.value) {
      const val = JSON.parse(element.value);
      for (let i = 0; i < val.blocks.length; i++) {
        let obj = {};
        if (val.blocks[i].type == "paragraph") {
          obj.type = val.blocks[i].type;
          obj.children = [
            {
              text: `${val.blocks[i].data.text}`,
              type: "text",
            },
          ];
          output.value.push(obj);
        } else if (val.blocks[i].type == "image") {
          let url = val.blocks[i].data.file.url;
          const lastSlashIndex = url.lastIndexOf("/");
          const imageExt = url.substring(lastSlashIndex + 1).split(".")[1];
          const imageName = url.substring(lastSlashIndex + 1).split(".")[0];
          let hash = imageName;
          let mime = val.blocks[i].data.file.mime;

          let out = {
            type: "image",
            image: {
              ext: `.${imageExt}`,
              url: url,
              hash: imageName,
              mime: mime,
              name: imageName,
              size: 61.21,
              width: 900,
              height: 600,
              caption: val.blocks[i].data.file?.alt,
              formats: {
                small: {
                  ext: `.${imageExt}`,
                  url: url,
                  hash: imageName,
                  mime: mime,
                  name: imageName,
                  path: null,
                  size: 23.29,
                  width: 500,
                  height: 333,
                },
                medium: {
                  ext: `.${imageExt}`,
                  url: url,
                  hash: imageName,
                  mime: mime,
                  name: imageName,
                  path: null,
                  size: 54.37,
                  width: 750,
                  height: 563,
                },
                thumbnail: {
                  ext: `.${imageExt}`,
                  url: url,
                  hash: imageName,
                  mime: mime,
                  name: imageName,
                  path: null,
                  size: 7.25,
                  width: 234,
                  height: 156,
                },
              },
              provider: "aws-s3",
              createdAt: createdAt,
              updatedAt: new Date(),
              previewUrl: null,
              alternativeText: val.blocks[i].data.file?.alt,
              provider_metadata: null,
            },
            children: [
              {
                text: "",
                type: "text",
              },
            ],
          };

          output.value.push(out);
        }
      }
    }
    modifyOption.push(output);
  });
  return modifyOption;
};

const explaination = (explaination) => {
  let exp = explaination;
  let modifyExplaination = "";
  exp.forEach((element) => {
    if (element.type == "paragraph") {
      modifyExplaination += `${element.data.text}`;
    }
  });
  return modifyExplaination;
};

module.exports = { question, option, explaination };

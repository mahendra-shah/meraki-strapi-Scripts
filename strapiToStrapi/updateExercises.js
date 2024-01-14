const axios = require('axios');
// let exerciseDataUrl = `https://merd-strapi.merakilearn.org/api/exercises/1`;

async function updateSingleExericisesData(exerciseDataUrl) {
  try {
    // Use Axios to make a GET request to the URL 
    const exerciseData = await axios.get(exerciseDataUrl)
    let finalData;
    let formatingData = exerciseData.data.data;
    let formatingDataJson = JSON.stringify(formatingData);

    // Parse the JSON string
    const formatingDataNEW = JSON.parse(formatingDataJson);

    // Extract the desired properties
    const { id, attributes: { name, description, type, createdAt, updatedAt, publishedAt, locale, course } } = formatingDataNEW;
    finalData = { id, name, description, content: null, type, created_at: createdAt, updated_at: updatedAt, published_at: publishedAt, locale, course };

    const originalContent = exerciseData.data.data.attributes.content;

    //convert the content to json
    const jsonContent = JSON.parse(originalContent).blocks;

    // formating the according the requirement
    let htmlContent = "";

    for (let i = 0; i < jsonContent.length; i++) {
      const block = jsonContent[i];
      if (block.type === "header") {
        htmlContent += `<h${block.data.level}><strong>${block.data.text}</strong></h${block.data.level}>`;
      } else if (block.type === "paragraph") {
        htmlContent += `<p>${block.data.text}</p>`;
      }
      else if (block.type === "image") {
        htmlContent += `<img src="${block.data.file.url}" alt="${block.data.file.alt}">`;
      }
      else if (block.type === "embed") {
        htmlContent += `<div data-youtube-video=""><iframe width="640" height="480" allowfullscreen="true" autoplay="false" disablekbcontrols="false" enableiframeapi="false" endtime="0" ivloadpolicy="0" loop="false" modestbranding="false" origin="" playlist="" src="https://www.youtube.com/embed/${block.data.source.split('youtu.be/')[1]}" start="0"></iframe></div>`;
      }
      else if (block.type === "list") {
        const listItems = block.data.items;
        const decoration = block.data.style === 'ordered'
          ? { type: 'number' }
          : { type: 'bullet' };
        const items = listItems.map((value, index) => ({
          component: 'text',
          value,
          decoration: {
            ...decoration,
            value: block.data.style === 'ordered' ? index + 1 : undefined
          }
        }));
        htmlContent += `<ul>`;
        for (let i = 0; i < items.length; i++) {
          htmlContent += `<li>${items[i].value}</li>`
        }
        htmlContent += `</ul>`;
      }
      else if (block.type === "code") {
        htmlContent += `<pre><code>${block.data.code}</code></pre>`;
      }
      else if (block.type === "table") {
        const tableData = block.data.content;
        htmlContent += `<table>`;
        for (let i = 0; i < tableData.length; i++) {
          htmlContent += `<tr>`;
          for (let j = 0; j < tableData[i].length; j++) {
            htmlContent += `<td>${tableData[i][j]}</td>`;
          }
          htmlContent += `</tr>`;
        }
        htmlContent += `</table>`;
      }
    }
    finalData['content'] = htmlContent;
    return finalData;

  } catch (error) {
    // Handle errors if any
    console.error('Error fetching data:', error.message);
  }
}
module.exports = updateSingleExericisesData;
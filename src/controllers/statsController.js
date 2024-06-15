const axios = require('axios');
const xlsx = require('xlsx');
const cheerio = require('cheerio');

const urlMapping = {
  "2023": {
    "infractiunile": "https://data.gov.ro/dataset/date-statistice-privind-situatia-drogurilor-in-romania-2023/resource/c2109600-9376-46cd-b8f1-4fd974bcb412",
    "campanii": "https://data.gov.ro/dataset/date-statistice-privind-situatia-drogurilor-in-romania-2023/resource/7c35fe80-e0b6-4f6c-b7f5-e603f009badb",
    "confiscari": "https://data.gov.ro/dataset/date-statistice-privind-situatia-drogurilor-in-romania-2023/resource/6b7aced4-a9df-4886-8660-af99b81fa7bd",
    "urgente": "https://data.gov.ro/dataset/date-statistice-privind-situatia-drogurilor-in-romania-2023/resource/616ab943-4c0a-4946-8ab4-8b25ac636ec4"
  },
  "2022": {
    "infractiunile": "https://data.gov.ro/dataset/date-statistice-privind-situatia-drogurilor-in-romania-2022/resource/fb13a6c4-d8f0-43f9-8c2a-1fb0c65077c0",
    "campanii": "https://data.gov.ro/dataset/date-statistice-privind-situatia-drogurilor-in-romania-2022/resource/4b0769ce-4e3d-47f4-81a2-93cc5d3f77a3",
    "confiscari": "https://data.gov.ro/dataset/date-statistice-privind-situatia-drogurilor-in-romania-2022/resource/d4144df8-e990-4256-9435-5f9e0c67015e",
    "urgente": "https://data.gov.ro/dataset/date-statistice-privind-consumul-de-droguri-in-romania-2021/resource/04543cfb-ff3e-4120-b9ac-9625df57e839"
  },
  "2021": {
    "urgente": "https://data.gov.ro/dataset/date-statistice-privind-consumul-de-droguri-in-romania-2021/resource/f776675f-8e04-469e-ada6-2c4920d55957"
  },
  "2020": {
    "urgente": "https://data.gov.ro/dataset/date-statistice-privind-consumul-de-droguri-in-romania-2020/resource/a208ed03-9e4d-4145-b36d-97a04e736b35"
  }
};

exports.getStats = async (req, res) => {
  const query = url.parse(req.url, true).query;
  const { years, category } = query;
  const selectedYears = years.split(',');

  try {
    const data = await Promise.all(selectedYears.map(async year => {
      const resourcePageUrl = urlMapping[year][category];

      // Fetch the resource page HTML
      const pageResponse = await axios.get(resourcePageUrl);
      const $ = cheerio.load(pageResponse.data);

      // Find the download link for the .xlsx file
      const downloadLink = $('a[href$=".xlsx"]').attr('href');

      // Fetch the .xlsx file
      const response = await axios.get(downloadLink, { responseType: 'arraybuffer' });
      const workbook = xlsx.read(response.data, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      return xlsx.utils.sheet_to_json(worksheet);
    }));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data.flat()));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: error.message }));
  }
};

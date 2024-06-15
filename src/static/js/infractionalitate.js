document.getElementById('logout').addEventListener('click', function(event) {
    event.preventDefault();
    localStorage.removeItem('token');
    window.location.href = '/';
});

let chartInstance = null;

document.getElementById('categories').addEventListener('change', function(event) {
    const subcategoriesGroup = document.getElementById('subcategories-group');
    const subcategoriesCondamnateGroup = document.getElementById('subcategories-condamnate-group');
    const subcategoriesUrgenteGroup = document.getElementById('subcategories-urgente');

    if (event.target.value === 'infractiunile') {
        subcategoriesGroup.style.display = 'block';
        subcategoriesCondamnateGroup.style.display = 'none';
        subcategoriesUrgenteGroup.style.display = 'none';
    } else if (event.target.value === 'urgente') {
        subcategoriesGroup.style.display = 'none';
        subcategoriesCondamnateGroup.style.display = 'none';
        subcategoriesUrgenteGroup.style.display = 'block';
    } else {
        subcategoriesGroup.style.display = 'none';
        subcategoriesCondamnateGroup.style.display = 'none';
        subcategoriesUrgenteGroup.style.display = 'none';
    }
});

document.getElementById('subcategories').addEventListener('change', function(event) {
    const subcategoriesCondamnateGroup = document.getElementById('subcategories-condamnate-group');
    if (event.target.value === 'persoane_condamnate') {
        subcategoriesCondamnateGroup.style.display = 'block';
    } else {
        subcategoriesCondamnateGroup.style.display = 'none';
    }
});

document.getElementById('statsForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const years = Array.from(document.getElementById('years').selectedOptions).map(option => option.value);
    const category = document.getElementById('categories').value;
    const subcategory = document.getElementById('subcategories').value;
    const subcategoryCondamnate = document.getElementById('subcategories-condamnate').value;
    const representation = document.getElementById('representation').value;
    const errorMessage = document.getElementById('errorMessage');
    const canvas = document.getElementById('myChart');

    if ((years.includes("2020") || years.includes("2021")) && category === "infractiunile") {
        canvas.style.display = 'none';
        errorMessage.style.display = 'block';
        return;
    } else {
        errorMessage.style.display = 'none';
        canvas.style.display = 'block';
    }

    if (years.includes("2023") || years.includes("2022")) {
        try {
            let fileName;
            if (years.includes("2023")) {
                fileName = category === "infractiunile" ? 'infractionalitate2023.xlsx' : 'urgente_medicale2023.xlsx';
            } else if (years.includes("2022")) {
                fileName = category === "infractiunile" ? 'infractionalitate2022.xlsx' : 'urgente_medicale2022.xlsx';
            }
            const response = await fetch(`/static/${fileName}`);
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            let labels, dataValues;

            if (category === "infractiunile") {
                if (subcategory === "persoane_cercetate") {
                    labels = ["Persoane cercetate", "Persoane trimise în judecată", "Persoane condamnate"];
                    dataValues = jsonData.slice(2, 5).map(row => row[1]);
                } else if (subcategory === "persoane_condamnate") {
                    if (subcategoryCondamnate === "incadrare_juridica") {
                        labels = ["Art.2 din Legea nr. 143/2000", "Art.3 din Legea nr. 143/2000", "Art.4 din Legea nr. 143/2000", "Legea nr. 194/2011"];
                        dataValues = jsonData.slice(8, 13).map(row => row[1]);
                    } else if (subcategoryCondamnate === "incadrare_sexe") {
                        labels = ["Bărbați majori", "Bărbați minori", "Femei majore", "Femei minore"];
                        dataValues = [
                            jsonData[16][1],
                            jsonData[16][2],
                            jsonData[17][1],
                            jsonData[17][2]
                        ];
                    }
                } else if (subcategory === "situatia_gruparilor") {
                    labels = ["Grupări identificate", "Număr persoane implicate în grupări"];
                    dataValues = jsonData.slice(21, 24).map(row => row[1]);
                } else if (subcategory === "situatia_pedepselor") {
                    labels = ["Executarea pedepsei", "Suspendarea pedepsei", "Amendă penală", "Amânarea executării pedepsei", "Măsuri neprivative de libertate-minori"];
                    dataValues = jsonData.slice(27, 32).map(row => [row[1], row[2]]);
                }
            } else if (category === "urgente") {
                if (subcategory === "gen") {
                    labels = ["Masculin Canabis", "Masculin Stimulanti", "Masculin Opiacee", "Masculin NSP", 
                              "Feminin Canabis", "Feminin Stimulanti", "Feminin Opiacee", "Feminin NSP"];
                    dataValues = [
                        jsonData[5][1], 
                        jsonData[4][2], 
                        jsonData[4][3], 
                        jsonData[4][4], 
                        jsonData[5][1], 
                        jsonData[5][2], 
                        jsonData[5][3], 
                        jsonData[5][4]
                    ];
                }
                // Adaugă alte subcategorii pentru "urgente" aici
            }
            console.log(`Labels: ${labels}`);
            console.log(`Data Values: ${dataValues}`);
            const ctx = canvas.getContext('2d');
            canvas.style.display = 'block';

            if (representation === 'pie') {
                canvas.classList.remove('large-chart');
                canvas.classList.add('small-chart');
            } else {
                canvas.classList.remove('small-chart');
                canvas.classList.add('large-chart');
            }

            if (chartInstance) {
                chartInstance.destroy();
            }

            let chartType;
            if (representation === "bar") {
                chartType = 'bar';
            } else if (representation === "line") {
                chartType = 'line';
            } else if (representation === "pie") {
                chartType = 'pie';
            }

            chartInstance = new Chart(ctx, {
                type: chartType,
                data: {
                    labels: labels,
                    datasets: [{
                        label: category === "infractiunile" ? 'Infracționalitatea la regimul drogurilor' : 'Urgențe medicale',
                        data: dataValues,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: representation === 'pie' ? [
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(75, 75, 192, 0.2)',
                            'rgba(192, 75, 75, 0.2)',
                            'rgba(192, 192, 75, 0.2)',
                            'rgba(75, 192, 75, 0.2)'
                        ] : 'rgba(75, 192, 192, 0.2)',
                    }]
                }
            });
        } catch (error) {
            console.error('There was an error fetching or processing the file:', error);
        }
    }
});

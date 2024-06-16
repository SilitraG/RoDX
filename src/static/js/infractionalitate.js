document.getElementById('logout').addEventListener('click', function(event) {
    event.preventDefault();
    localStorage.removeItem('token');
    window.location.href = '/';
});

let chartInstance = null;

document.getElementById('categories').addEventListener('change', function(event) {
    const subcategoriesInfractiunileGroup = document.getElementById('subcategories-infractiunile-group');
    const subcategoriesCondamnateGroup = document.getElementById('subcategories-condamnate-group');
    const subcategoriesUrgenteGroup = document.getElementById('subcategories-urgente-group');

    if (event.target.value === 'infractiunile') {
        subcategoriesInfractiunileGroup.style.display = 'block';
        subcategoriesCondamnateGroup.style.display = 'none';
        subcategoriesUrgenteGroup.style.display = 'none';
    } else if (event.target.value === 'urgente') {
        subcategoriesInfractiunileGroup.style.display = 'none';
        subcategoriesCondamnateGroup.style.display = 'none';
        subcategoriesUrgenteGroup.style.display = 'block';
    } else {
        subcategoriesInfractiunileGroup.style.display = 'none';
        subcategoriesCondamnateGroup.style.display = 'none';
        subcategoriesUrgenteGroup.style.display = 'none';
    }
});

document.getElementById('subcategories-infractiunile').addEventListener('change', function(event) {
    const subcategoriesCondamnateGroup = document.getElementById('subcategories-condamnate-group');
    if (event.target.value === 'persoane_condamnate') {
        subcategoriesCondamnateGroup.style.display = 'block';
    } else {
        subcategoriesCondamnateGroup.style.display = 'none';
    }
});

document.getElementById('statsForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const year = document.getElementById('years').value;
    const category = document.getElementById('categories').value;
    const subcategory = category === 'infractiunile' ? document.getElementById('subcategories-infractiunile').value : document.getElementById('subcategories-urgente').value;
    const subcategoryCondamnate = document.getElementById('subcategories-condamnate').value;
    const representation = document.getElementById('representation').value;
    const errorMessage = document.getElementById('errorMessage');
    const canvas = document.getElementById('myChart');

    if ((year === "2020" || year === "2021") && category === "infractiunile") {
        canvas.style.display = 'none';
        errorMessage.style.display = 'block';
        return;
    } else {
        errorMessage.style.display = 'none';
        canvas.style.display = 'block';
    }

    try {
        let fileName;
        if (year === "2023") {
            fileName = category === "infractiunile" ? 'infractionalitate2023.xlsx' : 'urgente_medicale2023.xlsx';
        } else if (year === "2022") {
            fileName = category === "infractiunile" ? 'infractionalitate2022.xlsx' : 'urgente_medicale2022.xlsx';
        }
        console.log(`Loading file: ${fileName}`);
        const response = await fetch(`/static/${fileName}`);
        if (!response.ok) {
            throw new Error(`Could not load file: ${fileName}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });


        let labels = [], dataValues = [];

        console.log(`Category: ${category}, Subcategory: ${subcategory}`); 

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
            if(subcategory === "gen")
                {
                const ageGroups = jsonData.slice(4, 6).map(row => row[0]);
                const columns = jsonData[3].slice(1); 

                ageGroups.forEach((ageGroup, rowIndex) => {
                    columns.forEach((column, colIndex) => {
                        labels.push(`${ageGroup} ${column}`);
                        dataValues.push(jsonData[rowIndex + 4][colIndex + 1]); 
                    });
                });

                }
            else
            if (subcategory === "varsta") {
                const ageGroups = jsonData.slice(9, 12).map(row => row[0]);
                const columns = jsonData[8].slice(1); 

                ageGroups.forEach((ageGroup, rowIndex) => {
                    columns.forEach((column, colIndex) => {
                        labels.push(`${ageGroup} ${column}`);
                        dataValues.push(jsonData[rowIndex + 9][colIndex + 1]); 
                    });
                });
            } else if (subcategory === "administrare") {
                const adminGroups = jsonData.slice(15, 18).map(row => row[0]);
                const columns = jsonData[14].slice(1);

                adminGroups.forEach((adminGroup, rowIndex) => {
                    columns.forEach((column, colIndex) => {
                        labels.push(`${adminGroup} ${column}`);
                        dataValues.push(jsonData[rowIndex + 15][colIndex + 1]);
                    });
                });
            } else if (subcategory === "model_consum") {
                const modelGroups = jsonData.slice(21, 23).map(row => row[0]);
                const columns = jsonData[20].slice(1);

                modelGroups.forEach((modelGroup, rowIndex) => {
                    columns.forEach((column, colIndex) => {
                        labels.push(`${modelGroup} ${column}`);
                        dataValues.push(jsonData[rowIndex + 21][colIndex + 1]);
                    });
                });
            } 
            else if (subcategory === "diagnostic") {
                const modelGroups = jsonData.slice(26, 34).map(row => row[0]);
                const columns = jsonData[25].slice(1);

                modelGroups.forEach((modelGroup, rowIndex) => {
                    columns.forEach((column, colIndex) => {
                        labels.push(`${modelGroup} ${column}`);
                        dataValues.push(jsonData[rowIndex + 26][colIndex + 1]);
                    });
                });
            }
            else {
                console.error("Invalid subcategory for 'urgente'");
                return;
            }
        } else {
            console.error("Invalid category");
            return;
        }
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
});

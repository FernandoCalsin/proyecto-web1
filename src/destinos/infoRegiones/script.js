
        let selectedRegion = null;

        const regionButtons = document.querySelectorAll('.btn-region');
        const infoButtons = document.querySelectorAll('.btn-info');
        const infoDisplay = document.getElementById('infoDisplay');

        regionButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                regionButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                selectedRegion = this.dataset.region;
                
                infoButtons.forEach(ib => ib.disabled = false);
                infoDisplay.classList.remove('show');
                infoDisplay.innerHTML = '';
            });
        });

        infoButtons.forEach(btn => {
            btn.addEventListener('click', async function() {
                if (!selectedRegion) return;

                const infoType = this.dataset.type;
                await fetchWikipediaInfo(selectedRegion, infoType);
            });
        });

        async function fetchWikipediaInfo(region, type) {
            infoDisplay.classList.add('show');
            infoDisplay.innerHTML = '<div class="loading">⏳ Cargando información...</div>';

            let searchQuery = region;
            
            if (type === 'historia') {
                searchQuery += ' historia';
            } else if (type === 'sitios') {
                searchQuery += ' turismo lugares importantes';
            } else if (type === 'movilidad') {
                searchQuery += ' transporte movilidad';
            }

            try {
                const searchUrl = `https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchQuery)}&format=json&origin=*&srlimit=1`;
                
                const searchResponse = await fetch(searchUrl);
                const searchData = await searchResponse.json();

                if (searchData.query.search.length === 0) {
                    throw new Error('No se encontró información');
                }

                const pageTitle = searchData.query.search[0].title;
                const pageId = searchData.query.search[0].pageid;

                const contentUrl = `https://es.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&pageids=${pageId}&format=json&origin=*`;
                
                const contentResponse = await fetch(contentUrl);
                const contentData = await contentResponse.json();

                const extract = contentData.query.pages[pageId].extract;
                const pageUrl = `https://es.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`;

                let title = '';
                if (type === 'historia') {
                    title = `📜 Historia de ${region}`;
                } else if (type === 'sitios') {
                    title = `🏛️ Sitios Importantes de ${region}`;
                } else if (type === 'movilidad') {
                    title = `🚌 Movilidad y Transporte en ${region}`;
                }

                infoDisplay.innerHTML = `
                    <h3>${title}</h3>
                    <p>${extract.substring(0, 800)}${extract.length > 800 ? '...' : ''}</p>
                    <a href="${pageUrl}" target="_blank" class="wiki-link">📖 Leer más en Wikipedia →</a>
                `;
            } catch (error) {
                infoDisplay.innerHTML = `
                    <div class="error">
                        ❌ No se pudo cargar la información. Por favor, intenta con otra región o tipo de información.
                    </div>
                `;
            }
        }
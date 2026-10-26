document.addEventListener('DOMContentLoaded', () => {
    // Theme Management
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');

    const saveTheme = (isDark) => {
        if (isDark) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            themeIcon.className = 'fa-solid fa-sun';
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            themeIcon.className = 'fa-solid fa-moon';
            localStorage.setItem('theme', 'light');
        }
    };

    // System theme preference detection
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark.matches)) {
        saveTheme(true);
    } else {
        saveTheme(false);
    }

    themeToggle.addEventListener('click', () => {
        const isDarkNow = body.classList.contains('dark-theme');
        saveTheme(!isDarkNow);
    });

    // Searchable Client Dropdown implementation
    const inputBuscarCliente = document.getElementById('buscar_cliente');
    const optionsContainer = document.getElementById('buscar_cliente_options');
    const sortedClientes = [...clientesDB].sort((a, b) => a.razon.localeCompare(b.razon));

    // Populate searchable select options list for Clients (max 15 results for performance)
    function renderOptions(filterText = '') {
        optionsContainer.innerHTML = '';
        const filtered = sortedClientes.filter(c => 
            c.razon.toLowerCase().includes(filterText.toLowerCase())
        ).slice(0, 15);

        if (filtered.length === 0) {
            const emptyOption = document.createElement('div');
            emptyOption.className = 'search-option no-results';
            emptyOption.textContent = 'Sin resultados';
            optionsContainer.appendChild(emptyOption);
            return;
        }

        filtered.forEach(cliente => {
            const option = document.createElement('div');
            option.className = 'search-option';
            option.textContent = cliente.razon;
            option.addEventListener('click', () => {
                inputBuscarCliente.value = cliente.razon;
                optionsContainer.classList.remove('show');
            });
            optionsContainer.appendChild(option);
        });
    }

    // Toggle dropdown on input focus
    inputBuscarCliente.addEventListener('focus', () => {
        renderOptions(inputBuscarCliente.value);
        optionsContainer.classList.add('show');
    });

    // Filter list on typing
    inputBuscarCliente.addEventListener('input', () => {
        renderOptions(inputBuscarCliente.value);
        optionsContainer.classList.add('show');
    });

    // Activities Database with LocalStorage persistence support
    const actividadesDB = [
        "ACTIVACIONES LÍNEA", "ACTIVIDAD COMERCIAL", "ANALISIS NIRS", "ANALISIS TÉCNICO-COMERCIAL", "ANCHETA",
        "APP ZOOTECNICA", "AQUAEXPERT INTERNACIONAL", "ARREGLO FACHADA", "ASISTENCIA TÉCNICA", "AVISO",
        "BOOTCAMP CLIENTES", "BOOTCAMP ESPECIALISTA", "BOOTCAMP GERENTES DE ZONA",
        "BROILER EXPERT", "BUENA VISTA", "CABALGATA", "CALIDAD DE AGUA", "CALIPER", "CAMPAMENTO VIRTUAL",
        "CAPACITACIÓN", "CEPI", "CERTIFICACIÓN", "CHARLA", "CLIENTE PROSPECTO", "COMERCIALIZADOR",
        "COMITÉ TECNICO", "CONCURSO RIFAS", "COSTOS EXPERT", "CRECIMIENTO CANAL DIRECTOS", "CREDITO GESTIÓN",
        "CURSO MAYORDOMIA", "DESCUENTO COMERCIAL", "DÍA DE BIOMETRÍA ACUÍCOLA", "DÍA DE CAMPO", "DÍA DE LA MASCOTA", "DÍA DE LA POLLITA",
        "DÍA DEL ALEVINO", "DIA DEL CERDITO", "DIA DEL POLLITO", "DOTACION CLIENTES", "ECOGRAFIAS",
        "EGG EXPERT", "EVALUACION DE CANAL", "EVALUACION PIGMENTO", "EXHIBICIÓN", "EXPERT REGIONAL",
        "EXPORTACIÓN", "FENAVI", "FENAVI BUCARAMANGA", "FERIA DE SERVICIOS", "FERIAS Y EVENTOS",
        "FIDELIZACIÓN", "FIDELIZACIÓN CON EQUIPOS", "GESTIÓN CUPO CRÉDITO", "GIRA DE MOSTRADORES",
        "GIRA DE PRODUCTORES", "GIRA PRODUCTORES", "ITALPAY", "JORNADA ACUÍCOLA", "JORNADA BIENESTAR",
        "JORNADA DE DESPARÁSITACIÓN", "LABORATORIOS", "LANZAMIENTO", "LETRERO", "LIQUIDACION LOTES",
        "MEDICACIÓN ESTRATEGICA", "MES ITALSAL", "MUESTRA COMERCIAL", "PCR", "PESAJE", "PLAN ALIMENTACIÓN", "PLAN NACIONAL SANIDAD",
        "PLAN SEMILLA", "PLAN VITAMINIZACIÓN", "PORCIGENES", "PORCIXPERT NACIONAL", "PORCIXPERT PLANTA", "PORCIXPERT REGIONAL",
        "PORKAMERICAS", "PORKCOLOMBIA", "PROGRAMACIÓN LEVANTE, PLAN ALIMENTACIÓN, MANEJO Y PLAN VACUNAL.",
        "PROSPECTO", "PUBLICIDAD", "QUEJAS", "RECEPCIÓN DE POLLITAS", "RELANZAMIENTO",
        "REVISIÓN RESULTADOS LEVANTE, RENDIMIENTO POLLITAS", "RIFA", "RUTA ESPECIALIZADA", "SANIDAD",
        "SEMINARIO", "SEÑALIZACIÓN ICA", "TALLER", "TALLER DE DESPOSTE", "TALLER DE INSEMINACIÓN", "TALLER EMBUTIDOS",
        "TELEMETRIA", "TOMA DE ALMACEN", "VACUNACION", "VECINO SOSTENIBLE", "VISITA COMERCIAL",
        "VISITA DE TRANSFERENCIA", "VISITA DIR LINEA"
    ];

    // Cargar actividades personalizadas guardadas previamente en localStorage
    const loadCustomActivities = () => {
        try {
            const saved = JSON.parse(localStorage.getItem('custom_actividades_vgr')) || [];
            saved.forEach(act => {
                const formatted = act.trim().toUpperCase();
                if (formatted && !actividadesDB.includes(formatted)) {
                    actividadesDB.push(formatted);
                }
            });
        } catch (e) {
            console.error('Error al cargar actividades personalizadas:', e);
        }
        actividadesDB.sort((a, b) => a.localeCompare(b));
    };

    loadCustomActivities();

    // Guardar una nueva actividad personalizada en localStorage y la memoria
    const saveCustomActivity = (newAct) => {
        const formatted = newAct.trim().toUpperCase();
        if (!actividadesDB.includes(formatted)) {
            actividadesDB.push(formatted);
            actividadesDB.sort((a, b) => a.localeCompare(b));
        }
        try {
            const saved = JSON.parse(localStorage.getItem('custom_actividades_vgr')) || [];
            if (!saved.includes(formatted)) {
                saved.push(formatted);
                localStorage.setItem('custom_actividades_vgr', JSON.stringify(saved));
            }
        } catch (e) {
            console.error('Error al guardar actividad personalizada:', e);
        }
    };

    // Normalizar texto eliminando tildes y caracteres especiales
    const normalizeString = (str) => {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toUpperCase()
            .trim();
    };

    // Calcular distancia Levenshtein entre dos cadenas
    const getLevenshteinDistance = (a, b) => {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    };

    // Buscar si existe una actividad idéntica o muy similar
    const checkActivitySimilarity = (inputText) => {
        const normInput = normalizeString(inputText);
        if (!normInput) return null;

        // 1. Coincidencia Exacta (ignorando tildes/mayúsculas)
        const exactMatch = actividadesDB.find(act => normalizeString(act) === normInput);
        if (exactMatch) {
            return { type: 'exact', match: exactMatch };
        }

        // 2. Coincidencia por Similitud Ortográfica
        let bestMatch = null;
        let highestSimilarity = 0;

        for (const act of actividadesDB) {
            const normAct = normalizeString(act);
            const distance = getLevenshteinDistance(normInput, normAct);
            const maxLength = Math.max(normInput.length, normAct.length);
            const similarity = 1 - (distance / maxLength);

            if (similarity > highestSimilarity) {
                highestSimilarity = similarity;
                bestMatch = act;
            }
        }

        // Umbral de similitud >= 68%
        if (highestSimilarity >= 0.68 && bestMatch) {
            return { type: 'similar', match: bestMatch, score: highestSimilarity };
        }

        return null;
    };

    // Searchable Activity Dropdown implementation
    const inputActividad = document.getElementById('buscar_actividad');
    const optionsActividadContainer = document.getElementById('actividad_options');

    // Modal elements for activity similarity confirmation
    const similarityModal = document.getElementById('similarityModal');
    const modalNuevaActividad = document.getElementById('modalNuevaActividad');
    const modalSugerencia = document.getElementById('modalSugerencia');
    const modalBtnExistenteTexto = document.getElementById('modalBtnExistenteTexto');
    const btnUseExisting = document.getElementById('btnUseExisting');
    const btnCreateNew = document.getElementById('btnCreateNew');
    const btnCancelModal = document.getElementById('btnCancelModal');

    let pendingNewActivity = '';
    let pendingExistingMatch = '';

    const openSimilarityModal = (newAct, existingMatch) => {
        pendingNewActivity = newAct.trim().toUpperCase();
        pendingExistingMatch = existingMatch;

        modalNuevaActividad.textContent = pendingNewActivity;
        modalSugerencia.innerHTML = `<i class="fa-solid fa-lightbulb"></i> Actividad Sugerida: <strong>"${pendingExistingMatch}"</strong>`;
        modalBtnExistenteTexto.textContent = pendingExistingMatch;

        similarityModal.style.display = 'flex';
    };

    const closeSimilarityModal = () => {
        similarityModal.style.display = 'none';
        pendingNewActivity = '';
        pendingExistingMatch = '';
    };

    btnUseExisting.addEventListener('click', () => {
        if (pendingExistingMatch) {
            addActivityToSelection(pendingExistingMatch);
            showToast(`Se seleccionó la actividad existente "${pendingExistingMatch}".`, 'success');
        }
        closeSimilarityModal();
    });

    btnCreateNew.addEventListener('click', () => {
        if (pendingNewActivity) {
            saveCustomActivity(pendingNewActivity);
            addActivityToSelection(pendingNewActivity);
            showToast(`Nueva actividad "${pendingNewActivity}" creada y guardada.`, 'success');
        }
        closeSimilarityModal();
    });

    btnCancelModal.addEventListener('click', closeSimilarityModal);

    // Populate searchable select options list for Activities (max 15 results for performance)
    function renderActividadOptions(filterText = '') {
        optionsActividadContainer.innerHTML = '';
        const filtered = actividadesDB.filter(act => 
            act.toLowerCase().includes(filterText.toLowerCase())
        ).slice(0, 15);

        if (filtered.length === 0) {
            const emptyOption = document.createElement('div');
            emptyOption.className = 'search-option no-results';
            emptyOption.textContent = 'Sin resultados en la lista oficial';
            optionsActividadContainer.appendChild(emptyOption);
            return;
        }

        filtered.forEach(act => {
            const option = document.createElement('div');
            option.className = 'search-option';
            option.textContent = act;
            option.addEventListener('click', () => {
                inputActividad.value = act;
                optionsActividadContainer.classList.remove('show');
            });
            optionsActividadContainer.appendChild(option);
        });
    }

    // Toggle dropdown on input focus
    inputActividad.addEventListener('focus', () => {
        renderActividadOptions(inputActividad.value);
        optionsActividadContainer.classList.add('show');
    });

    // Filter list on typing and force uppercase
    inputActividad.addEventListener('input', () => {
        inputActividad.value = inputActividad.value.toUpperCase();
        renderActividadOptions(inputActividad.value);
        optionsActividadContainer.classList.add('show');
    });

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.searchable-select-wrapper')) {
            optionsContainer.classList.remove('show');
            optionsActividadContainer.classList.remove('show');
        }
    });

    // Multiselect Activity Logic
    const selectedActivities = [];
    const btnAddActividad = document.getElementById('btnAddActividad');
    const actividadesTagsContainer = document.getElementById('actividades_tags');
    const textActividad = document.getElementById('actividad'); // Hidden textarea

    const updateActivityMetadata = () => {
        if (selectedActivities.length === 0) {
            actividadesTagsContainer.innerHTML = `<span style="color: var(--text-secondary); font-size: 14px; font-style: italic; padding: 4px 0;">Ninguna actividad añadida aún</span>`;
            textActividad.value = '';
            return;
        }

        // Render Tags
        actividadesTagsContainer.innerHTML = '';
        selectedActivities.forEach((actName, index) => {
            const tag = document.createElement('div');
            tag.className = 'client-tag'; // Reuse styling
            tag.innerHTML = `
                <span>${actName}</span>
                <button type="button" class="btn-remove" data-index="${index}">&times;</button>
            `;
            actividadesTagsContainer.appendChild(tag);
        });

        // Set hidden textarea value for submission and WhatsApp extraction
        textActividad.value = selectedActivities.join(', ');
    };

    // Add Activity Event (with similarity check and custom addition)
    btnAddActividad.addEventListener('click', () => {
        const rawVal = inputActividad.value.trim();
        if (!rawVal) {
            showToast('Por favor, escribe o selecciona una actividad primero.', 'error');
            return;
        }

        // 1. Buscar coincidencia exacta
        const exactFound = actividadesDB.find(act => act.toLowerCase() === rawVal.toLowerCase() || normalizeString(act) === normalizeString(rawVal));

        if (exactFound) {
            if (selectedActivities.includes(exactFound)) {
                showToast('Esta actividad ya ha sido añadida.', 'error');
                return;
            }
            selectedActivities.push(exactFound);
            updateActivityMetadata();
            inputActividad.value = '';
            showToast('Actividad añadida.', 'success');
            return;
        }

        // 2. Verificar similitud ortográfica
        const similarityResult = checkActivitySimilarity(rawVal);
        if (similarityResult && similarityResult.type === 'similar') {
            openSimilarityModal(rawVal, similarityResult.match);
            return;
        }

        // 3. Si no hay coincidencia ni similitud alta, permitir guardarla como nueva actividad personalizada
        saveCustomActivity(rawVal);
        addActivityToSelection(rawVal);
        inputActividad.value = '';
        showToast(`Nueva actividad "${rawVal.toUpperCase()}" creada y añadida.`, 'success');
    });

    const addActivityToSelection = (actName) => {
        const formatted = actName.trim().toUpperCase();
        if (selectedActivities.includes(formatted)) {
            showToast('Esta actividad ya ha sido añadida.', 'error');
            return;
        }
        selectedActivities.push(formatted);
        updateActivityMetadata();
    };

    // Remove Activity Tag Event
    actividadesTagsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remove')) {
            const index = parseInt(e.target.getAttribute('data-index'), 10);
            selectedActivities.splice(index, 1);
            updateActivityMetadata();
            showToast('Actividad removida.', 'success');
        }
    });

    // Set Default Date to Today & Range Dates handling
    const inputFecha = document.getElementById('fecha');
    const selectTipoEventoFecha = document.getElementById('tipo_evento_fecha');
    const fechaUnicaContainer = document.getElementById('fecha_unica_container');
    const rangoFechasContainer = document.getElementById('rango_fechas_container');
    const inputFechaDesde = document.getElementById('fecha_desde');
    const inputFechaHasta = document.getElementById('fecha_hasta');

    const today = new Date().toISOString().split('T')[0];
    inputFecha.value = today;
    inputFechaDesde.value = today;
    inputFechaHasta.value = today;
    inputFechaHasta.min = today;

    // Alternar entre Fecha nica y Rango de Fechas
    selectTipoEventoFecha.addEventListener('change', () => {
        const val = selectTipoEventoFecha.value;
        if (val === 'No') {
            fechaUnicaContainer.style.display = 'flex';
            rangoFechasContainer.classList.remove('active');
            inputFecha.required = true;
            inputFechaDesde.required = false;
            inputFechaHasta.required = false;
        } else {
            fechaUnicaContainer.style.display = 'none';
            rangoFechasContainer.classList.add('active');
            inputFecha.required = false;
            inputFechaDesde.required = true;
            inputFechaHasta.required = true;
            if (!inputFechaDesde.value) inputFechaDesde.value = inputFecha.value || today;
            if (!inputFechaHasta.value) inputFechaHasta.value = inputFechaDesde.value;
            inputFechaHasta.min = inputFechaDesde.value;
        }
    });

    inputFechaDesde.addEventListener('change', () => {
        inputFechaHasta.min = inputFechaDesde.value;
        if (inputFechaHasta.value && inputFechaHasta.value < inputFechaDesde.value) {
            inputFechaHasta.value = inputFechaDesde.value;
        }
    });

    // Multiselect Client Logic
    const selectedClients = [];
    const btnAddCliente = document.getElementById('btnAddCliente');
    const clientesTagsContainer = document.getElementById('clientes_tags');
    const textRazonSocial = document.getElementById('razon_social');
    const inputZona = document.getElementById('zona');
    const selectCanal = document.getElementById('canal');

    const updateClientMetadata = () => {
        if (selectedClients.length === 0) {
            clientesTagsContainer.innerHTML = `<span style="color: var(--text-secondary); font-size: 14px; font-style: italic; padding: 4px 0;">Ningún cliente añadido aún</span>`;
            textRazonSocial.value = '';
            inputZona.value = '';
            selectCanal.value = '';
            return;
        }

        // Render Tags
        clientesTagsContainer.innerHTML = '';
        selectedClients.forEach((clientName, index) => {
            const tag = document.createElement('div');
            tag.className = 'client-tag';
            tag.innerHTML = `
                <span>${clientName}</span>
                <button type="button" class="btn-remove" data-index="${index}">&times;</button>
            `;
            clientesTagsContainer.appendChild(tag);
        });

        // Set hidden text value
        textRazonSocial.value = selectedClients.join(', ');

        // Automatic autocompletion logic for multiple clients
        const managers = [];
        const channels = [];

        selectedClients.forEach(clientName => {
            const found = clientesDB.find(c => c.razon === clientName);
            if (found) {
                if (found.gerente && !managers.includes(found.gerente)) {
                    managers.push(found.gerente);
                }
                if (found.canal && !channels.includes(found.canal)) {
                    channels.push(found.canal);
                }
            }
        });

        // Autocomplete outputs
        inputZona.value = managers.join(', ');
        
        if (channels.length === 1) {
            selectCanal.value = channels[0];
        } else if (channels.length > 1) {
            selectCanal.value = ""; // Let user choose if channels differ
        }

        // Si hay prospectos (clientes no encontrados en clientesDB) o es modo prospecto activo,
        // permitimos escribir libremente el Gerente de Zona
        const hasProspects = selectedClients.some(c => !clientesDB.find(db => db.razon === c));
        const esProspectoActivo = document.getElementById('es_prospecto').value === 'Sí';

        if (hasProspects || esProspectoActivo) {
            inputZona.removeAttribute('readonly');
            inputZona.placeholder = "Escribe el Gerente de Zona...";
        } else {
            inputZona.setAttribute('readonly', 'true');
            inputZona.placeholder = "Se autocompleta según el cliente...";
        }
    };

    // ¿Es un Cliente Prospecto? Toggle container visibility
    const selectEsProspecto = document.getElementById('es_prospecto');
    const prospectoNombreContainer = document.getElementById('prospecto_nombre_container');
    const inputProspectoNombre = document.getElementById('prospecto_nombre');
    const btnAddProspecto = document.getElementById('btnAddProspecto');

    selectEsProspecto.addEventListener('change', () => {
        if (selectEsProspecto.value === 'Sí') {
            prospectoNombreContainer.classList.add('active');
            inputProspectoNombre.required = true;
            inputZona.removeAttribute('readonly');
            inputZona.placeholder = "Escribe el Gerente de Zona...";
        } else {
            prospectoNombreContainer.classList.remove('active');
            inputProspectoNombre.required = false;
            inputProspectoNombre.value = '';
            updateClientMetadata();
        }
    });

    // Auto-capitalize Prospect Name input field
    inputProspectoNombre.addEventListener('input', () => {
        inputProspectoNombre.value = inputProspectoNombre.value.toUpperCase();
    });

    // Add Client Event (from searchable list)
    btnAddCliente.addEventListener('click', () => {
        const clientVal = inputBuscarCliente.value.trim();
        if (!clientVal) {
            showToast('Por favor, selecciona un cliente primero.', 'error');
            return;
        }

        // Verificar que sea un cliente de la base de datos
        const exists = clientesDB.some(c => c.razon === clientVal);
        if (!exists) {
            showToast('Cliente no encontrado. Si es nuevo, activa la opción de Cliente Prospecto.', 'error');
            return;
        }

        if (selectedClients.includes(clientVal)) {
            showToast('Este cliente ya ha sido añadido.', 'error');
            return;
        }

        selectedClients.push(clientVal);
        updateClientMetadata();
        inputBuscarCliente.value = ''; // Reset select
        showToast('Cliente añadido.', 'success');
    });

    // Add Prospect Client Event
    btnAddProspecto.addEventListener('click', () => {
        const prospectVal = inputProspectoNombre.value.trim().toUpperCase();
        if (!prospectVal) {
            showToast('Por favor, escribe el nombre del cliente prospecto.', 'error');
            return;
        }

        if (selectedClients.includes(prospectVal)) {
            showToast('Este cliente ya ha sido añadido.', 'error');
            return;
        }

        selectedClients.push(prospectVal);
        updateClientMetadata();
        inputProspectoNombre.value = ''; // Reset input
        showToast('Prospecto añadido.', 'success');
    });

    // Remove Client Tag Event
    clientesTagsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remove')) {
            const index = parseInt(e.target.getAttribute('data-index'), 10);
            selectedClients.splice(index, 1);
            updateClientMetadata();
            showToast('Cliente removido.', 'success');
        }
    });

    // Photo & Collage upload handler (1 to 4 photos)
    const inputFoto = document.getElementById('foto_evidencia');
    const fileNameText = document.getElementById('file_name_text');
    const imagePreviewContainer = document.getElementById('image_preview_container');
    const imagePreview = document.getElementById('image_preview');
    const btnRemoveFoto = document.getElementById('btnRemoveFoto');
    const btnClearAllFotos = document.getElementById('btnClearAllFotos');
    const collageCounterBadge = document.getElementById('collage_counter_badge');
    const collageLayoutsBar = document.getElementById('collage_layouts_bar');
    const collageLayoutButtons = document.getElementById('collage_layout_buttons');
    const collageThumbsContainer = document.getElementById('collage_thumbs_container');
    const collageThumbsList = document.getElementById('collage_thumbs_list');
    const thumbsCountText = document.getElementById('thumbs_count_text');

    let uploadedImages = []; // Array of { id, img, name, dataUrl }
    let currentLayout = 'auto'; // 'auto', '2-col', '2-row', '3-top', '3-left', '4-grid'
    let fotoBase64 = '';
    let fotoNombre = '';
    let fotoFile = null; // Archivo final combinado para Web Share API

    // Función para dibujar una imagen centrada con recorte proporcional (object-fit: cover)
    const drawImageCover = (ctx, img, x, y, w, h, radius = 0) => {
        ctx.save();
        if (radius > 0) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + w - radius, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
            ctx.lineTo(x + w, y + h - radius);
            ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
            ctx.lineTo(x + radius, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.clip();
        }

        const imgRatio = img.width / img.height;
        const targetRatio = w / h;
        let sWidth, sHeight, sx, sy;

        if (imgRatio > targetRatio) {
            sHeight = img.height;
            sWidth = img.height * targetRatio;
            sx = (img.width - sWidth) / 2;
            sy = 0;
        } else {
            sWidth = img.width;
            sHeight = img.width / targetRatio;
            sx = 0;
            sy = (img.height - sHeight) / 2;
        }

        ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
        ctx.restore();
    };

    // Renderizar la barra de layouts según la cantidad de fotos
    const updateLayoutButtons = () => {
        collageLayoutButtons.innerHTML = '';
        const count = uploadedImages.length;

        if (count < 2) {
            collageLayoutsBar.style.display = 'none';
            return;
        }

        collageLayoutsBar.style.display = 'flex';
        let options = [];

        if (count === 2) {
            options = [
                { id: '2-col', label: 'Lado a lado (Verticales)', icon: 'fa-table-columns' },
                { id: '2-row', label: 'Arriba / Abajo (Horizontales)', icon: 'fa-grip-lines' }
            ];
            if (currentLayout !== '2-col' && currentLayout !== '2-row') {
                currentLayout = '2-col';
            }
        } else if (count === 3) {
            options = [
                { id: '3-top', label: '1 Grande Arriba + 2 Abajo', icon: 'fa-table-cells' },
                { id: '3-left', label: '1 Grande Izquierda + 2 Derecha', icon: 'fa-table-cells-large' }
            ];
            if (currentLayout !== '3-top' && currentLayout !== '3-left') {
                currentLayout = '3-top';
            }
        } else if (count === 4) {
            options = [
                { id: '4-grid', label: 'Cuadrícula 2×2', icon: 'fa-border-all' }
            ];
            currentLayout = '4-grid';
        }

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn-layout-option' + (currentLayout === opt.id ? ' active' : '');
            btn.innerHTML = `<i class="fa-solid ${opt.icon}"></i> ${opt.label}`;
            btn.addEventListener('click', () => {
                currentLayout = opt.id;
                document.querySelectorAll('.btn-layout-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                generateCollageOrSingle();
            });
            collageLayoutButtons.appendChild(btn);
        });
    };

    // Actualizar la tira de miniaturas
    const updateThumbnails = () => {
        collageThumbsList.innerHTML = '';
        const count = uploadedImages.length;
        thumbsCountText.textContent = count;

        if (count === 0) {
            collageThumbsContainer.style.display = 'none';
            collageCounterBadge.style.display = 'none';
            btnClearAllFotos.style.display = 'none';
            return;
        }

        collageThumbsContainer.style.display = 'block';
        collageCounterBadge.style.display = 'inline-block';
        collageCounterBadge.textContent = `${count} / 4 fotos`;
        btnClearAllFotos.style.display = 'inline-flex';

        uploadedImages.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'collage-thumb-card';
            card.innerHTML = `
                <img src="${item.dataUrl}" alt="Foto ${index + 1}">
                <button type="button" class="btn-remove-thumb" title="Eliminar foto">&times;</button>
            `;

            card.querySelector('.btn-remove-thumb').addEventListener('click', () => {
                uploadedImages.splice(index, 1);
                updateLayoutButtons();
                updateThumbnails();
                generateCollageOrSingle();
                showToast('Foto eliminada del collage.', 'success');
            });

            collageThumbsList.appendChild(card);
        });
    };

    // Generar la imagen final (1 foto individual o Collage de 2 a 4 fotos)
    const generateCollageOrSingle = () => {
        const count = uploadedImages.length;

        if (count === 0) {
            inputFoto.value = '';
            fotoBase64 = '';
            fotoNombre = '';
            fotoFile = null;
            fileNameText.textContent = 'Ningún archivo seleccionado';
            imagePreviewContainer.style.display = 'none';
            imagePreview.src = '';
            collageLayoutsBar.style.display = 'none';
            collageThumbsContainer.style.display = 'none';
            collageCounterBadge.style.display = 'none';
            btnClearAllFotos.style.display = 'none';
            return;
        }

        fileNameText.textContent = 'Procesando ' + (count === 1 ? 'imagen...' : `collage de ${count} fotos...`);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (count === 1) {
            // Renderizado de 1 sola foto respetando su proporción
            const img = uploadedImages[0].img;
            const max_size = 1000;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > max_size) {
                    height = Math.round(height * (max_size / width));
                    width = max_size;
                }
            } else {
                if (height > max_size) {
                    width = Math.round(width * (max_size / height));
                    height = max_size;
                }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            fotoNombre = uploadedImages[0].name.replace(/\.[^/.]+$/, '') + '.jpg';
        } else {
            // Lienzo cuadrado para collage
            const size = 1200;
            canvas.width = size;
            canvas.height = size;

            // Fondo blanco y separación limpia
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, size, size);

            const gap = 14;
            const radius = 6;

            if (count === 2) {
                if (currentLayout === '2-row') {
                    // Arriba y Abajo
                    const h = (size - gap * 3) / 2;
                    const w = size - gap * 2;
                    drawImageCover(ctx, uploadedImages[0].img, gap, gap, w, h, radius);
                    drawImageCover(ctx, uploadedImages[1].img, gap, gap * 2 + h, w, h, radius);
                } else {
                    // Lado a lado (2-col default)
                    const w = (size - gap * 3) / 2;
                    const h = size - gap * 2;
                    drawImageCover(ctx, uploadedImages[0].img, gap, gap, w, h, radius);
                    drawImageCover(ctx, uploadedImages[1].img, gap * 2 + w, gap, w, h, radius);
                }
            } else if (count === 3) {
                if (currentLayout === '3-left') {
                    // 1 Grande a la izquierda + 2 a la derecha
                    const wLeft = (size - gap * 3) * 0.55;
                    const wRight = (size - gap * 3) * 0.45;
                    const hFull = size - gap * 2;
                    const hHalf = (size - gap * 3) / 2;

                    drawImageCover(ctx, uploadedImages[0].img, gap, gap, wLeft, hFull, radius);
                    drawImageCover(ctx, uploadedImages[1].img, gap * 2 + wLeft, gap, wRight, hHalf, radius);
                    drawImageCover(ctx, uploadedImages[2].img, gap * 2 + wLeft, gap * 2 + hHalf, wRight, hHalf, radius);
                } else {
                    // 1 Grande arriba + 2 abajo (3-top default)
                    const hTop = (size - gap * 3) * 0.55;
                    const hBottom = (size - gap * 3) * 0.45;
                    const wFull = size - gap * 2;
                    const wHalf = (size - gap * 3) / 2;

                    drawImageCover(ctx, uploadedImages[0].img, gap, gap, wFull, hTop, radius);
                    drawImageCover(ctx, uploadedImages[1].img, gap, gap * 2 + hTop, wHalf, hBottom, radius);
                    drawImageCover(ctx, uploadedImages[2].img, gap * 2 + wHalf, gap * 2 + hTop, wHalf, hBottom, radius);
                }
            } else if (count >= 4) {
                // Cuadrícula 2x2
                const w = (size - gap * 3) / 2;
                const h = (size - gap * 3) / 2;

                drawImageCover(ctx, uploadedImages[0].img, gap, gap, w, h, radius);
                drawImageCover(ctx, uploadedImages[1].img, gap * 2 + w, gap, w, h, radius);
                drawImageCover(ctx, uploadedImages[2].img, gap, gap * 2 + h, w, h, radius);
                drawImageCover(ctx, uploadedImages[3].img, gap * 2 + w, gap * 2 + h, w, h, radius);
            }

            fotoNombre = `collage_${count}_fotos_${Date.now()}.jpg`;
        }

        // Comprimir como JPEG de alta calidad
        const dataUrl = canvas.toDataURL('image/jpeg', 0.78);
        fotoBase64 = dataUrl.split(',')[1];

        // Crear File para Web Share API
        canvas.toBlob((blob) => {
            fotoFile = new File([blob], fotoNombre, { type: 'image/jpeg' });
        }, 'image/jpeg', 0.78);

        fileNameText.textContent = count === 1 ? fotoNombre : `Collage activo (${count} fotos combinadas)`;
        imagePreview.src = dataUrl;
        imagePreviewContainer.style.display = 'inline-block';
    };

    // Procesar archivos seleccionados (soporta selección múltiple o adición secuencial)
    inputFoto.addEventListener('change', () => {
        const files = Array.from(inputFoto.files);
        if (!files || files.length === 0) return;

        const availableSlots = 4 - uploadedImages.length;
        if (availableSlots <= 0) {
            showToast('Ya tienes el máximo de 4 fotos cargadas. Elimina alguna para agregar otra.', 'error');
            inputFoto.value = '';
            return;
        }

        const filesToProcess = files.slice(0, availableSlots);
        if (files.length > availableSlots) {
            showToast(`Solo se añadieron ${availableSlots} foto(s) para respetar el máximo de 4.`, 'error');
        }

        let loadedCount = 0;
        filesToProcess.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    uploadedImages.push({
                        id: Date.now() + Math.random(),
                        img: img,
                        name: file.name,
                        dataUrl: e.target.result
                    });

                    loadedCount++;
                    if (loadedCount === filesToProcess.length) {
                        updateLayoutButtons();
                        updateThumbnails();
                        generateCollageOrSingle();
                        showToast(uploadedImages.length > 1 ? `Collage actualizado (${uploadedImages.length} fotos).` : 'Foto cargada con éxito.', 'success');
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });

        // Limpiar el input para permitir volver a seleccionar la misma foto si se desea
        inputFoto.value = '';
    });

    // Vaciar todas las fotos
    const clearAllUploadedPhotos = () => {
        uploadedImages = [];
        currentLayout = 'auto';
        generateCollageOrSingle();
        showToast('Fotos removidas.', 'success');
    };

    btnRemoveFoto.addEventListener('click', clearAllUploadedPhotos);
    btnClearAllFotos.addEventListener('click', clearAllUploadedPhotos);

    // Activity selection element
    const selectActividad = document.getElementById('actividad');


    // Helper function for conditional animation toggles
    const setupConditionalToggle = (selectId, containerId, inputId) => {
        const select = document.getElementById(selectId);
        const container = document.getElementById(containerId);
        const input = document.getElementById(inputId);

        select.addEventListener('change', () => {
            if (select.value === 'Sí') {
                container.classList.add('active');
                input.required = true;
            } else {
                container.classList.remove('active');
                input.required = false;
                input.value = '';
            }
        });
    };

    setupConditionalToggle('apoyo_aliado', 'aliado_quien_container', 'apoyo_aliado_quien');

    // Forzar mayúsculas automáticamente en Apoyo Aliado mientras se escribe
    const inputApoyoAliadoQuien = document.getElementById('apoyo_aliado_quien');
    if (inputApoyoAliadoQuien) {
        inputApoyoAliadoQuien.addEventListener('input', () => {
            inputApoyoAliadoQuien.value = inputApoyoAliadoQuien.value.toUpperCase();
        });
    }
    setupConditionalToggle('apoyo_especialista', 'especialista_quien_container', 'apoyo_especialista_quien');
    setupConditionalToggle('apoyo_gerente_zona', 'gerente_quien_container', 'apoyo_gerente_zona_quien');
    setupConditionalToggle('asignacion_economica', 'gasto_costo_container', 'gasto_costo');

    // Auto-formatting for Colombian Pesos (COP)
    const inputGastoCosto = document.getElementById('gasto_costo');
    inputGastoCosto.addEventListener('input', (e) => {
        let value = e.target.value;
        // Keep only numbers
        value = value.replace(/\D/g, "");
        if (value) {
            // Format as COP currency
            const formatted = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(parseInt(value));
            e.target.value = formatted;
        } else {
            e.target.value = "";
        }
    });

    // Build Payload Helper
    const getPayload = () => {
        const persona = document.getElementById('persona').value;
        const tipoEvento = selectTipoEventoFecha.value;
        const esRango = tipoEvento !== 'No';

        let fecha = document.getElementById('fecha').value;
        const fechaDesde = inputFechaDesde.value;
        const fechaHasta = inputFechaHasta.value;

        if (esRango) {
            if (fechaDesde && fechaHasta && fechaDesde !== fechaHasta) {
                fecha = fechaDesde + ' al ' + fechaHasta;
            } else {
                fecha = fechaDesde || fechaHasta || fecha;
            }
        }

        const lugar = document.getElementById('lugar').value;
        const razon_social = textRazonSocial.value;
        const zona = inputZona.value;
        const canal = selectCanal.value;
        const linea = document.getElementById('linea').value;
        const pilar = document.getElementById('pilar').value;
        const marca = document.getElementById('marca').value;
        
        let actividad = selectActividad.value;
        // Si es evento especial, anteponer tipo en la actividad para Google Sheets
        if (esRango && actividad) {
            actividad = '[' + tipoEvento.toUpperCase() + '] ' + actividad;
        }

        const observaciones = document.getElementById('observaciones').value;
        const apoyo_aliado = document.getElementById('apoyo_aliado').value;
        const apoyo_aliado_quien = document.getElementById('apoyo_aliado_quien').value;
        const apoyo_especialista = document.getElementById('apoyo_especialista').value;
        const apoyo_especialista_quien = document.getElementById('apoyo_especialista_quien').value;
        const apoyo_gerente_zona = document.getElementById('apoyo_gerente_zona').value;
        const apoyo_gerente_zona_quien = document.getElementById('apoyo_gerente_zona_quien').value;

        const asignacion_economica = document.getElementById('asignacion_economica').value;
        const gasto_costo = inputGastoCosto.value;

        return {
            persona, fecha, lugar, razon_social, zona, canal, linea, pilar, marca, actividad,
            tipoEvento, fechaDesde, fechaHasta, esRango,
            observaciones, apoyo_aliado, apoyo_aliado_quien, apoyo_especialista, apoyo_especialista_quien,
            apoyo_gerente_zona, apoyo_gerente_zona_quien,
            asignacion_economica, gasto_costo,
            fotoBase64, fotoNombre
        };
    };

    // Formatear fecha en español (ej: "1 de julio de 2026")
    const formatFechaES = (isoDate) => {
        if (!isoDate) return '';
        const [year, month, day] = isoDate.split('-');
        const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
        return `${parseInt(day)} de ${meses[parseInt(month) - 1]} de ${year}`;
    };

    // Generar texto en formato WhatsApp (sin incluir quien realiza la visita)
    const generateWhatsAppText = () => {
        const data = getPayload();

        if (!data.fecha || !data.lugar || !data.razon_social || !data.linea || !data.pilar || !data.marca || !data.actividad || !data.observaciones) {
            showToast('Por favor, completa los campos requeridos antes de enviar.', 'error');
            return null;
        }

        let fechaFormateada = '';

        if (data.esRango && data.fechaDesde && data.fechaHasta && data.fechaDesde !== data.fechaHasta) {

            fechaFormateada = `Del ${formatFechaES(data.fechaDesde)} al ${formatFechaES(data.fechaHasta)}`;
        } else if (data.esRango && (data.fechaDesde || data.fechaHasta)) {

            fechaFormateada = formatFechaES(data.fechaDesde || data.fechaHasta);

        } else {

            fechaFormateada = formatFechaES(data.fecha);

        }

        // Los clientes van como lista con viñetas (• )
        const clientesLista = data.razon_social
            .split(',')
            .map(c => `• ${c.trim()}`)
            .join('\n');

        // Las actividades van como lista con viñetas (• )
        const actividadesLista = data.actividad
            .split(',')
            .map(a => `• ${a.trim()}`)
            .join('\n');

        // Sin nombre de quien realiza la visita
        let txt = `Fecha: ${fechaFormateada}\n\n`;
        if (data.esRango && data.tipoEvento) {
            txt += `Tipo de Evento: ${data.tipoEvento}\n\n`;
        }
        txt += `Lugar: ${data.lugar}\n\n`;
        if (data.zona) txt += `Zona: ${data.zona}\n\n`;
        if (data.canal) txt += `Canal: ${data.canal}\n\n`;
        txt += `Linea: ${data.linea}\n\n`;
        txt += `Razon social:\n\n${clientesLista}\n\n`;
        txt += `Pilar: ${data.pilar}\n\n`;
        txt += `Marca: ${data.marca}\n\n`;
        txt += `Actividades:\n\n${actividadesLista}\n\n`;
        txt += `Observaciones: ${data.observaciones}\n\n`;

        if (data.apoyo_aliado === 'Sí') txt += `Apoyo aliado: ${data.apoyo_aliado_quien}\n\n`;
        if (data.apoyo_especialista === 'Sí') txt += `Apoyo especialista: ${data.apoyo_especialista_quien}\n\n`;
        if (data.apoyo_gerente_zona === 'Sí') txt += `Apoyo Gerente de Zona: ${data.apoyo_gerente_zona_quien}\n\n`;
        if (data.asignacion_economica === 'Sí') {
            txt += `Asignación económica: Sí\n\n`;
            txt += `Gasto / Costo: ${data.gasto_costo}\n\n`;
        }

        return txt.trim();
    };

    // Action button elements
    const btnWhatsApp = document.getElementById('btnWhatsApp');
    const btnGuardar  = document.getElementById('btnGuardar');
    const btnDescargarExcel = document.getElementById('btnDescargarExcel');

    if (btnDescargarExcel) {
        btnDescargarExcel.addEventListener('click', () => {
            const originalContent = btnDescargarExcel.innerHTML;
            btnDescargarExcel.innerHTML = `<span class="spinner" style="width:14px; height:14px; margin-right:4px;"></span> <span class="excel-btn-text">Generando Excel...</span>`;
            showToast('Generando y descargando el reporte Excel...', 'success');
            setTimeout(() => {
                btnDescargarExcel.innerHTML = originalContent;
            }, 2500);
        });
    }

    btnWhatsApp.addEventListener('click', async () => {
        const text = generateWhatsAppText();
        if (!text) return;

        // Si hay imagen y el navegador soporta Web Share API con archivos,
        // compartir texto + foto directamente (abre WhatsApp con ambos adjuntos)
        if (fotoFile && navigator.canShare && navigator.canShare({ files: [fotoFile] })) {
            try {
                await navigator.share({
                    text: text,
                    files: [fotoFile]
                });
            } catch (err) {
                // El usuario canceló o hubo un error — fallback a enlace de texto
                if (err.name !== 'AbortError') {
                    const encoded = encodeURIComponent(text);
                    window.open(`https://wa.me/?text=${encoded}`, '_blank');
                }
            }
        } else {
            // Sin imagen o sin soporte de Web Share: abrir WhatsApp con solo el texto
            const encoded = encodeURIComponent(text);
            window.open(`https://wa.me/?text=${encoded}`, '_blank');
        }
    });

    // Save to Google Sheets Logic
    btnGuardar.addEventListener('click', () => {
        const webhookUrl = 'https://script.google.com/macros/s/AKfycbynXnG4YR2EaXxU3qpRfD8-uAhoWSap57nh-JrR1SUAw6zzlsdmKk6gZe4IAxFyow_S/exec';

        const data = getPayload();
        // Validation check
        if (!data.persona || !data.fecha || !data.lugar || !data.razon_social || !data.linea || !data.pilar || !data.marca || !data.actividad || !data.observaciones) {
            showToast('Por favor, completa todo el formulario antes de guardar.', 'error');
            return;
        }

        // Set Loading state
        const originalContent = btnGuardar.innerHTML;
        btnGuardar.disabled = true;
        btnGuardar.innerHTML = `<span class="spinner"></span> Guardando...`;

        // text/plain es un tipo "simple" de CORS: no dispara preflight,
        // no-cors lo envía completo, y Apps Script lo recibe en e.postData.contents.
        fetch(webhookUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify(data)
        })
        .then(() => {
            // Note: with mode: 'no-cors', response is opaque. We assume success if it doesn't fail.
            showToast('¡Visita registrada con éxito en Google Sheets!', 'success');
            
            // Clean dynamic values of the form (except persona, fecha and location for fast typing)
            selectedClients.length = 0;
            updateClientMetadata();
            inputBuscarCliente.value = '';
            selectedActivities.length = 0;
            updateActivityMetadata();
            inputActividad.value = '';
            selectTipoEventoFecha.value = 'No';
            selectTipoEventoFecha.dispatchEvent(new Event('change'));
            selectEsProspecto.value = 'No';
            selectEsProspecto.dispatchEvent(new Event('change'));
            document.getElementById('pilar').value = '';
            document.getElementById('marca').value = '';
            document.getElementById('linea').value = '';
            document.getElementById('observaciones').value = '';

            // Clean photo & collage input
            clearAllUploadedPhotos();

            // Reset supports
            ['apoyo_aliado', 'apoyo_especialista', 'apoyo_gerente_zona', 'asignacion_economica'].forEach(id => {
                document.getElementById(id).value = 'No';
                document.getElementById(id).dispatchEvent(new Event('change'));
            });

        })
        .catch(err => {
            showToast('Error al enviar a Google Sheets. Revisa la URL e intenta nuevamente.', 'error');
            console.error(err);
        })
        .finally(() => {
            btnGuardar.disabled = false;
            btnGuardar.innerHTML = originalContent;
        });
    });

    // Custom Toast Alert notification system
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');
    let toastTimeout;

    function showToast(message, type = 'success') {
        clearTimeout(toastTimeout);
        toastMessage.textContent = message;
        toast.className = 'toast show ' + type;
        
        if (type === 'success') {
            toastIcon.innerHTML = `<i class="fa-solid fa-circle-check"></i>`;
        } else {
            toastIcon.innerHTML = `<i class="fa-solid fa-circle-xmark"></i>`;
        }

        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }
});

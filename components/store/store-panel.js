/**
 * Panel de tienda del vendedor — Dashboard, publicaciones y formulario.
 */
(function (global) {
    'use strict';

    const SS = () => global.StoreService;
    const RS = () => global.RoleService;

    let container = null;
    let store = null;
    let user = null;
    let currentView = 'dashboard';
    let photoList = [];
    let isPublishing = false;

    function esc(str) {
        if (str == null) return '';
        const d = document.createElement('div');
        d.textContent = String(str);
        return d.innerHTML;
    }

    function init(el, storeData) {
        container = el;
        store = storeData;
        user = RS().getCurrentUser();
        currentView = 'dashboard';
        photoList = [];
        render();
    }

    function showView(view) {
        currentView = view;
        if (view === 'create') photoList = [];
        render();
        if (view === 'create') bindPhotoInput();
    }

    function refresh() {
        user = RS().getCurrentUser();
        store = RS().getStore();
        render();
    }

    function render() {
        if (!container || !store || !user) return;

        const stats = SS().getStats(user, store);

        container.innerHTML = `
            <div class="store-panel">
                <div class="store-panel-header">
                    <div>
                        <h3>${esc(store.name)}</h3>
                        <p class="text-muted mb-0"><i class="fas fa-map-marker-alt me-1"></i>${esc(store.location)}</p>
                    </div>
                    ${currentView === 'dashboard' ? `
                        <button type="button" class="store-create-main-btn" id="storeGoCreateBtn" aria-label="${esc(SS().t('store_create_post', 'Crear publicación'))}">
                            <i class="fas fa-plus"></i> ${esc(SS().t('store_create_post', 'Crear publicación'))}
                        </button>
                    ` : ''}
                </div>

                <nav class="store-nav" role="tablist" aria-label="${esc(SS().t('store_nav', 'Navegación de tienda'))}">
                    <button type="button" class="store-nav-btn${currentView === 'dashboard' ? ' active' : ''}" data-view="dashboard" role="tab" aria-selected="${currentView === 'dashboard'}">
                        ${esc(SS().t('store_nav_dashboard', 'Home'))}
                    </button>
                    <button type="button" class="store-nav-btn${currentView === 'publications' ? ' active' : ''}" data-view="publications" role="tab" aria-selected="${currentView === 'publications'}">
                        ${esc(SS().t('store_nav_publications', 'Mis publicaciones'))}
                    </button>
                    <button type="button" class="store-nav-btn${currentView === 'create' ? ' active' : ''}" data-view="create" role="tab" aria-selected="${currentView === 'create'}">
                        ${esc(SS().t('store_nav_create', 'Crear publicación'))}
                    </button>
                </nav>

                <div class="store-view" id="storeViewContent">
                    ${currentView === 'dashboard' ? renderDashboard(stats) : ''}
                    ${currentView === 'publications' ? renderPublications() : ''}
                    ${currentView === 'create' ? renderCreateForm() : ''}
                </div>
            </div>`;

        bindEvents();
    }

    function renderDashboard(stats) {
        return `
            <div class="store-section-title">${esc(SS().t('store_summary', 'Resumen'))}</div>
            <div class="store-stat-grid three-col">
                <div class="store-stat-card">
                    <div class="store-stat-value">${stats.chatsToAnswer}</div>
                    <div class="store-stat-label">${esc(SS().t('store_stat_chats', 'Chats para responder'))}</div>
                </div>
                <div class="store-stat-card">
                    <div class="store-stat-value">${stats.activePublications}</div>
                    <div class="store-stat-label">${esc(SS().t('store_stat_active', 'Publicaciones activas'))}</div>
                </div>
                <div class="store-stat-card">
                    <div class="store-stat-value">${stats.toRenew}</div>
                    <div class="store-stat-label">${esc(SS().t('store_stat_renew', 'Publicaciones para renovar'))}</div>
                </div>
            </div>

            <div class="store-section-title">${esc(SS().t('store_performance', 'Rendimiento'))}</div>
            <div class="store-stat-grid three-col">
                <div class="store-stat-card">
                    <div class="store-stat-value">${stats.clicks7d}</div>
                    <div class="store-stat-label">${esc(SS().t('store_stat_clicks', 'Clics en publicaciones (7 días)'))}</div>
                </div>
                <div class="store-stat-card">
                    <div class="store-stat-value">${stats.rating || '0'}<span style="font-size:0.9rem;color:#666;"> (${stats.reviewCount})</span></div>
                    <div class="store-stat-label">${esc(SS().t('store_stat_rating', 'Calificación como vendedor'))}</div>
                </div>
                <div class="store-stat-card">
                    <div class="store-stat-value">${stats.followers7d}</div>
                    <div class="store-stat-label">${esc(SS().t('store_stat_followers', 'Nuevos seguidores (7 días)'))}</div>
                </div>
            </div>`;
    }

    function renderPublications() {
        const products = SS().getSellerProducts(user.id);

        if (!products.length) {
            return `
                <div class="store-empty-state">
                    <i class="fas fa-box-open fa-3x mb-3" style="color:#800000;opacity:0.5;"></i>
                    <p>${esc(SS().t('store_no_publications', 'Aún no tienes publicaciones.'))}</p>
                    <button type="button" class="store-create-main-btn mt-2" id="storeEmptyCreateBtn">
                        <i class="fas fa-plus"></i> ${esc(SS().t('store_create_post', 'Crear publicación'))}
                    </button>
                </div>`;
        }

        return products.map(p => {
            const status = p.publicationStatus || 'active';
            const statusLabel = SS().PUBLICATION_STATUSES[status] || status;
            const statusClass = status === 'active' ? 'active' : status === 'pending' ? 'pending' : 'inactive';
            const created = p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '';
            const productUrl = `product.html?id=${encodeURIComponent(String(p.id))}`;
            return `
                <div class="store-publication-card" data-product-id="${esc(p.id)}">
                    <img src="${esc(p.mainImage || p.images?.[0] || '')}" alt="" loading="lazy">
                    <div class="store-publication-info">
                        <h5>${esc(p.name)}</h5>
                        <div class="store-publication-meta">
                            <span><strong>B/. ${Number(p.price).toFixed(2)}</strong></span>
                            <span>${esc(SS().getCategoryLabel(p.category))}</span>
                            <span>${esc(p.productCondition || '—')}</span>
                            <span class="store-badge ${statusClass}">${esc(statusLabel)}</span>
                            ${created ? `<span class="store-pub-date">${esc(created)}</span>` : ''}
                        </div>
                        <div class="store-publication-actions">
                            <a href="${productUrl}" class="btn btn-sm btn-outline-primary" target="_blank" rel="noopener">
                                <i class="fas fa-eye"></i> ${esc(SS().t('store_view_product', 'Ver producto'))}
                            </a>
                            <button type="button" class="btn btn-sm btn-outline-danger store-delete-pub" data-id="${esc(p.id)}">
                                <i class="fas fa-trash"></i> ${esc(SS().t('store_delete_pub', 'Eliminar'))}
                            </button>
                        </div>
                    </div>
                </div>`;
        }).join('');
    }

    function renderCreateForm() {
        const catOptions = SS().CATEGORIES.map(c =>
            `<option value="${c.value}">${esc(c.label)}</option>`
        ).join('');

        const condOptions = SS().CONDITIONS.map(c =>
            `<option value="${esc(c)}">${esc(c)}</option>`
        ).join('');

        const defaultLocation = store.location || user.location || '';
        const artisanPreview = SS().buildArtisanFromUser(user, store, defaultLocation);

        return `
            <h4 class="mb-4" style="font-family:'Playfair Display',serif;color:#800000;">${esc(SS().t('store_new_post', 'Nueva publicación'))}</h4>

            <div class="store-artisan-preview mb-4">
                <img src="${esc(artisanPreview.avatar || '')}" alt="" class="store-artisan-preview__avatar" width="48" height="48">
                <div>
                    <strong>${esc(artisanPreview.name)}</strong>
                    <p class="text-muted small mb-0">${esc(SS().t('store_artisan_auto', 'Publicando como artesano verificado'))}</p>
                </div>
            </div>

            <div id="storeFormErrors" class="store-form-errors d-none" role="alert"></div>

            <form id="storePublicationForm" novalidate>
                <div class="store-form-section">
                    <label>${esc(SS().t('store_add_photos', 'Agregar fotos'))} *</label>
                    <p class="text-muted small mb-2">${esc(SS().t('store_photos_hint', 'Máximo 10 fotos. La primera será la principal.'))}</p>
                    <input type="file" id="storePhotoInput" accept="image/*" multiple hidden>
                    <div class="store-photo-grid" id="storePhotoGrid">
                        <button type="button" class="store-add-photo-btn" id="storeAddPhotoBtn" aria-label="${esc(SS().t('store_add_photos', 'Agregar fotos'))}">
                            <i class="fas fa-camera fa-lg mb-1"></i>
                            <span style="font-size:0.8rem;">${esc(SS().t('store_add_photos', 'Agregar fotos'))}</span>
                        </button>
                    </div>
                </div>

                <div class="store-form-section">
                    <label for="storeTitle">${esc(SS().t('store_title', 'Título'))} *</label>
                    <input type="text" class="form-control" id="storeTitle" maxlength="120" required placeholder="${esc(SS().t('store_title_ph', 'Nombre del producto'))}">
                </div>

                <div class="store-form-section">
                    <label for="storePrice">${esc(SS().t('store_price', 'Precio'))} (B/.) *</label>
                    <div class="input-group">
                        <span class="input-group-text">B/.</span>
                        <input type="number" class="form-control" id="storePrice" min="0.01" step="0.01" required placeholder="0.00">
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 store-form-section">
                        <label for="storeCategory">${esc(SS().t('store_category', 'Categoría'))} *</label>
                        <select class="form-select" id="storeCategory" required>
                            <option value="">${esc(SS().t('store_select', 'Seleccionar...'))}</option>
                            ${catOptions}
                        </select>
                    </div>
                    <div class="col-md-6 store-form-section">
                        <label for="storeCondition">${esc(SS().t('store_condition', 'Estado'))} *</label>
                        <select class="form-select" id="storeCondition" required>
                            <option value="">${esc(SS().t('store_select', 'Seleccionar...'))}</option>
                            ${condOptions}
                        </select>
                    </div>
                </div>

                <div class="store-form-section">
                    <label for="storeDescription">${esc(SS().t('store_description', 'Descripción'))} *</label>
                    <textarea class="form-control" id="storeDescription" rows="5" required placeholder="${esc(SS().t('store_desc_ph', 'Describe tu producto...'))}"></textarea>
                </div>

                <div class="store-form-section">
                    <label for="storeLocation">${esc(SS().t('store_location', 'Ubicación'))} *</label>
                    <input type="text" class="form-control" id="storeLocation" required value="${esc(defaultLocation)}" placeholder="${esc(SS().t('store_location_ph', 'Ciudad, provincia'))}">
                    <p class="text-muted small mt-1">${esc(SS().t('store_location_hint', 'Por defecto desde tu tienda. Puedes ajustarla para esta publicación.'))}</p>
                </div>

                <div class="store-form-section">
                    <h5 class="store-optional-title">${esc(SS().t('store_extra_info', 'Información adicional (opcional)'))}</h5>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="storeMaterial">${esc(SS().t('store_material', 'Material'))}</label>
                            <input type="text" class="form-control" id="storeMaterial" placeholder="${esc(SS().t('store_material_ph', 'Ej: Fibra natural'))}">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="storeTechnique">${esc(SS().t('store_technique', 'Técnica'))}</label>
                            <input type="text" class="form-control" id="storeTechnique" placeholder="${esc(SS().t('store_technique_ph', 'Ej: Tejido manual'))}">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="storeElaboration">${esc(SS().t('store_elaboration', 'Tiempo de elaboración'))}</label>
                            <input type="text" class="form-control" id="storeElaboration" placeholder="${esc(SS().t('store_elaboration_ph', 'Ej: 2 semanas'))}">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="storeDimensions">${esc(SS().t('store_dimensions', 'Dimensiones'))}</label>
                            <input type="text" class="form-control" id="storeDimensions" placeholder="${esc(SS().t('store_dimensions_ph', 'Ej: 30 × 20 cm'))}">
                        </div>
                    </div>
                    <label for="storeCulturalStory">${esc(SS().t('store_cultural_story', 'Historia / significado cultural'))}</label>
                    <textarea class="form-control" id="storeCulturalStory" rows="3" placeholder="${esc(SS().t('store_cultural_story_ph', 'Cuenta la historia detrás de esta pieza...'))}"></textarea>
                </div>

                <div class="store-policies">
                    <h4>${esc(SS().t('store_before_publish', 'Antes de publicar'))}</h4>
                    <p class="text-muted small mb-3">${esc(SS().t('store_before_publish_text', 'Verifica que la información de tu producto sea correcta antes de publicar. Utiliza fotografías reales y proporciona una descripción clara y precisa.'))}</p>
                    <h4>${esc(SS().t('store_policies', 'Políticas de publicación'))}</h4>
                    <ul>
                        <li>${esc(SS().t('store_policy_1', 'Utiliza fotografías reales del producto.'))}</li>
                        <li>${esc(SS().t('store_policy_2', 'La descripción debe corresponder al artículo publicado.'))}</li>
                        <li>${esc(SS().t('store_policy_3', 'El precio debe ser correcto.'))}</li>
                        <li>${esc(SS().t('store_policy_4', 'Proporciona información clara y verdadera.'))}</li>
                        <li>${esc(SS().t('store_policy_5', 'No publiques productos prohibidos o ilegales.'))}</li>
                        <li>${esc(SS().t('store_policy_6', 'No utilices información engañosa.'))}</li>
                        <li>${esc(SS().t('store_policy_7', 'Las publicaciones pueden ser revisadas antes de hacerse visibles.'))}</li>
                    </ul>
                </div>

                <div class="text-center mt-4">
                    <button type="submit" class="store-publish-btn" id="storePublishBtn">
                        <span class="store-publish-label">${esc(SS().t('store_publish', 'Publicar'))}</span>
                        <span class="store-publish-loading d-none"><i class="fas fa-spinner fa-spin"></i> ${esc(SS().t('store_publishing', 'Publicando...'))}</span>
                    </button>
                </div>
            </form>`;
    }

    function renderPhotoGrid() {
        const grid = container.querySelector('#storePhotoGrid');
        if (!grid) return;

        const addBtn = grid.querySelector('#storeAddPhotoBtn');
        grid.querySelectorAll('.store-photo-item').forEach(el => el.remove());

        photoList.forEach((src, idx) => {
            const item = document.createElement('div');
            item.className = 'store-photo-item' + (idx === 0 ? ' main-photo' : '');
            item.innerHTML = `
                <img src="${src}" alt="">
                ${idx === 0 ? `<span class="store-photo-badge">${esc(SS().t('store_main_photo', 'Principal'))}</span>` : ''}
                <div class="store-photo-actions">
                    ${idx > 0 ? `<button type="button" data-action="left" data-idx="${idx}" aria-label="Mover izquierda"><i class="fas fa-arrow-left"></i></button>` : ''}
                    ${idx < photoList.length - 1 ? `<button type="button" data-action="right" data-idx="${idx}" aria-label="Mover derecha"><i class="fas fa-arrow-right"></i></button>` : ''}
                    <button type="button" data-action="delete" data-idx="${idx}" aria-label="Eliminar"><i class="fas fa-trash"></i></button>
                </div>`;
            grid.insertBefore(item, addBtn);
        });

        if (addBtn) {
            addBtn.style.display = photoList.length >= 10 ? 'none' : 'flex';
        }
    }

    function bindPhotoInput() {
        const input = container.querySelector('#storePhotoInput');
        const addBtn = container.querySelector('#storeAddPhotoBtn');
        if (!input || !addBtn) return;

        addBtn.onclick = () => input.click();
        input.onchange = () => {
            const files = Array.from(input.files || []);
            const remaining = 10 - photoList.length;
            files.slice(0, remaining).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    photoList.push(e.target.result);
                    renderPhotoGrid();
                };
                reader.readAsDataURL(file);
            });
            input.value = '';
        };

        container.querySelector('#storePhotoGrid')?.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-action]');
            if (!btn) return;
            const idx = Number(btn.dataset.idx);
            const action = btn.dataset.action;
            if (action === 'delete') {
                photoList.splice(idx, 1);
            } else if (action === 'left' && idx > 0) {
                [photoList[idx - 1], photoList[idx]] = [photoList[idx], photoList[idx - 1]];
            } else if (action === 'right' && idx < photoList.length - 1) {
                [photoList[idx], photoList[idx + 1]] = [photoList[idx + 1], photoList[idx]];
            }
            renderPhotoGrid();
        });
    }

    function bindEvents() {
        container.querySelectorAll('.store-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => showView(btn.dataset.view));
        });

        container.querySelector('#storeGoCreateBtn')?.addEventListener('click', () => showView('create'));
        container.querySelector('#storeEmptyCreateBtn')?.addEventListener('click', () => showView('create'));

        container.querySelectorAll('.store-delete-pub').forEach(btn => {
            btn.addEventListener('click', () => handleDeletePublication(btn.dataset.id));
        });

        const form = container.querySelector('#storePublicationForm');
        if (form) {
            bindPhotoInput();
            form.addEventListener('submit', handlePublish);
        }
    }

    function handlePublish(e) {
        e.preventDefault();
        if (isPublishing) return;

        const errorsEl = container.querySelector('#storeFormErrors');
        const publishBtn = container.querySelector('#storePublishBtn');

        const data = {
            images: [...photoList],
            title: container.querySelector('#storeTitle')?.value || '',
            price: container.querySelector('#storePrice')?.value,
            category: container.querySelector('#storeCategory')?.value || '',
            productCondition: container.querySelector('#storeCondition')?.value || '',
            description: container.querySelector('#storeDescription')?.value || '',
            location: container.querySelector('#storeLocation')?.value || '',
            materials: container.querySelector('#storeMaterial')?.value || '',
            technique: container.querySelector('#storeTechnique')?.value || '',
            elaborationTime: container.querySelector('#storeElaboration')?.value || '',
            dimensions: container.querySelector('#storeDimensions')?.value || '',
            culturalStory: container.querySelector('#storeCulturalStory')?.value || ''
        };

        isPublishing = true;
        if (publishBtn) publishBtn.disabled = true;
        publishBtn?.querySelector('.store-publish-label')?.classList.add('d-none');
        publishBtn?.querySelector('.store-publish-loading')?.classList.remove('d-none');

        const result = SS().publishProduct(data);

        isPublishing = false;
        if (publishBtn) publishBtn.disabled = false;
        publishBtn?.querySelector('.store-publish-label')?.classList.remove('d-none');
        publishBtn?.querySelector('.store-publish-loading')?.classList.add('d-none');

        if (!result.success) {
            if (errorsEl) {
                errorsEl.classList.remove('d-none');
                errorsEl.innerHTML = `<strong>${esc(SS().t('store_fix_errors', 'Completa lo siguiente:'))}</strong><ul>${(result.errors || [result.message]).map(er => `<li>${esc(er)}</li>`).join('')}</ul>`;
                errorsEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        if (errorsEl) errorsEl.classList.add('d-none');
        showToast(SS().t('store_publish_success', '¡Publicación creada correctamente!'));
        photoList = [];
        showView('publications');
        user = RS().getCurrentUser();
    }

    function handleDeletePublication(productId) {
        if (!productId) return;
        if (!confirm(SS().t('store_delete_confirm', '¿Eliminar esta publicación? Dejará de aparecer en Explore.'))) return;

        const result = SS().deletePublication(productId);
        if (!result.success) {
            alert(result.message || SS().t('store_delete_error', 'No se pudo eliminar'));
            return;
        }
        showToast(SS().t('store_delete_success', 'Publicación eliminada'));
        refresh();
    }

    function showToast(msg) {
        const existing = document.querySelector('.store-success-toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.className = 'store-success-toast';
        toast.setAttribute('role', 'status');
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }

    global.StorePanel = { init, showView, refresh };
})(window);
